import { inject, injectable } from "inversify";
import { ReCheckInResponse, UMInfo } from "sc-user-service-client/dist/auth";
import { PlayerStore } from "../players";
import { GameServiceMessage, IHandler } from "../shared";
import NameGenerator from "../shared/utils/name-generator";
import { StorageManager, localStorageKeys } from "../shared/utils/storage-manager";
import { AuthStore, ISessionInfo } from "./auth-store";
import { UserService } from "./user-service";

interface IAuthorizeResponse {
    errorCode?: string;
    message?: string;
    isSuccessful?: boolean;
    isUM?: boolean;
    umInfo?: UMInfo;
    authorized?: boolean;
    user?: GameServiceMessage.User;
}

export namespace AuthHandlers {
    @injectable()
    export class Authorize implements IHandler<{ session: string; username: string }> {
        private session = "";
        private username = "";
        constructor(
            @inject(AuthStore) private readonly authStore: AuthStore,
            @inject(PlayerStore) private readonly playerStore: PlayerStore,
            @inject(UserService) private readonly userService: UserService
        ) {}

        async handle({ session = "", username = "" }) {
            const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
            this.session = session || sessionInfo?.session;
            this.username = username || sessionInfo?.username;
            const response = (await this.userService.authorize(this.session, this.username)) as IAuthorizeResponse;
            if (response.isUM) {
                this.authStore.setUM(response.umInfo);
            } else {
                if (response.isSuccessful !== undefined && !response.isSuccessful) {
                    this.authStore.signOut();
                } else {
                    await this.handleAuthorizedResponse(response);
                }
            }
        }

        private async handleAuthorizedResponse(response: IAuthorizeResponse) {
            if (!response.authorized && this.authStore.isDirectMode) {
                await this.autoGenerateName();
            } else {
                response.user && this.playerStore.setAuthorizeStore(response.user);
                this.authStore.isAuthorized = response.authorized;
            }
        }

        private async autoGenerateName() {
            const name = NameGenerator.generateName();
            const response = await this.userService.signName(this.session, this.username, name);
            await this.handleAuthorizedResponse(response as IAuthorizeResponse);
        }
    }

    @injectable()
    export class SSO implements IHandler<{ urlParams: URLSearchParams; system: number }> {
        constructor(
            @inject(AuthStore) private readonly store: AuthStore,
            @inject(UserService) private readonly userService: UserService,
            @inject(Authorize) private readonly authorizeHandler: Authorize
        ) {}

        async handle({ urlParams, system }: { urlParams: URLSearchParams; system: number }) {
            if (!this.isValidSessionStorage(urlParams)) {
                return;
            }

            await this.handleAuthorizeWithURLParams(urlParams, system);
        }

        private isValidSessionStorage(urlParams: URLSearchParams) {
            const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
            const isSessionExpired = verifySession(sessionInfo);
            if (isSessionExpired && !urlParams.has("token")) {
                this.store.signOut();
                return false;
            }

            return true;
        }

        private async handleAuthorizeWithURLParams(urlParams: URLSearchParams, system: number) {
            if (urlParams.has("token")) {
                this.store.isDirectMode = true;
                const token = urlParams.get("token");
                this.clearParamsOnUrl();
                await this.handleSSOAndAuthorize(token, system);
            } else {
                await this.handleAuthorize();
            }
        }

        private async handleSSOAndAuthorize(token: string, system: number) {
            const response = await this.userService.sso(token, system);
            if (response.isUM) {
                this.store.setUM(response.umInfo);
                return;
            }
            if (response.isAuthenticated) {
                this.store.setAuthSSOStore(response);
                StorageManager.set(localStorageKeys.session, this.store.getSessionInfo());
                await this.handleAuthorize(response.ss, response.username);
            }
        }

        private async handleAuthorize(session?: string, username?: string) {
            if (!session || !username) {
                const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
                if (!sessionInfo) {
                    this.store.signOut();
                    return;
                }
                session = sessionInfo.session;
                username = sessionInfo.username;
            }
            await this.authorizeHandler.handle({ session, username });
        }

        private clearParamsOnUrl() {
            try {
                history.pushState(null, "", location.href.split("?")[0]);
            } catch (ex) {
                console.log(ex);
            }
        }
    }

    @injectable()
    export class ReCheckIn implements IHandler<{ sessionInfo: ISessionInfo }> {
        constructor(
            @inject(AuthStore) private readonly authStore: AuthStore,
            @inject(PlayerStore) private readonly playerStore: PlayerStore,
            @inject(UserService) private readonly userService: UserService
        ) {}

        async handle({ sessionInfo }) {
            const { session, username } = sessionInfo;
            const response = await this.userService.reCheckIn(session || this.authStore.session, username || this.authStore.username);
            if (response.isSuccessful) {
                this.handleSuccessful(response, sessionInfo);
            } else {
                this.authStore.signOut();
            }
        }

        private handleSuccessful(response: ReCheckInResponse, sessionInfo: ISessionInfo) {
            if (response.apiError) {
                this.handleError(response);
            } else {
                this.authStore.setAuthStoreFromStorage(sessionInfo);
                StorageManager.set(localStorageKeys.session, this.authStore.getSessionInfo());
                this.playerStore.setBalance(response.balance, response.scoins, response.availSpins);
            }
        }

        private handleError(response: ReCheckInResponse) {
            const errorCode = response.apiError.errorCode.toString();
            const expiredSessionErrorCodes = ["1001", "1002"];
            this.authStore.errorCode = errorCode;
            if (response.isDisableAccount) {
                this.authStore.isDisabledAccount = true;
                this.authStore.signOut();
            } else {
                if (expiredSessionErrorCodes.includes(errorCode)) {
                    this.authStore.signOut();
                }
            }
        }
    }

    @injectable()
    export class TriggerRecheckIn implements IHandler<void> {
        private reCheckInId: NodeJS.Timeout;

        constructor(@inject(ReCheckIn) private readonly reCheckIn: ReCheckIn, @inject(AuthStore) private readonly authStore: AuthStore) {}

        async handle() {
            this.clearInterval();
            this.reCheckInId = setInterval(() => {
                this.handleRecheckIn();
            }, 60 * 1000);
        }

        private async handleRecheckIn() {
            const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
            const isSessionExpired = verifySession(sessionInfo);

            if (isSessionExpired) {
                this.authStore.signOut();
            } else {
                await this.reCheckIn.handle({ sessionInfo });
            }
        }

        clearInterval() {
            this.reCheckInId && clearInterval(this.reCheckInId);
        }
    }

    @injectable()
    export class GetBalance implements IHandler<{ session: string; username: string }> {
        constructor(
            @inject(AuthStore) private readonly authStore: AuthStore,
            @inject(PlayerStore) private readonly playerStore: PlayerStore,
            @inject(UserService) private readonly userService: UserService
        ) {}

        async handle({ session = "", username = "" }) {
            const response = await this.userService.getBalance(session, username);
            if (response.isSuccessful) {
                this.playerStore.setBalance(response.balance, response.scoins, response.availableSpins);
            } else {
                this.authStore.errorCode = response.errorCode;
            }
        }
    }

    @injectable()
    export class SessionTimeout implements IHandler<void> {
        constructor(@inject(TriggerRecheckIn) private readonly triggerRecheckIn: TriggerRecheckIn) {}

        handle() {
            this.triggerRecheckIn.clearInterval();
            StorageManager.remove(localStorageKeys.session);
        }
    }

    const SESSION_EXPIRED_TIMEOUT_MINUTES = 19.8;
    const verifySession = (sessionInfo: ISessionInfo) => {
        let isSessionExpired = true;

        try {
            if (sessionInfo && sessionInfo.ssoTime) {
                const now: Date = new Date();
                const lastRecheckIn: Date = new Date(sessionInfo.ssoTime);
                const differenceInMinutes = Math.abs(now.getMinutes() - lastRecheckIn.getMinutes());

                if (differenceInMinutes <= SESSION_EXPIRED_TIMEOUT_MINUTES) {
                    isSessionExpired = false;
                }
            }
        } catch (ex) {
            console.log(ex);
        }

        return isSessionExpired;
    };
}
