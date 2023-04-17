import { inject, injectable } from "inversify";
import { ReCheckInResponse, UMInfo } from "sc-user-service-client/dist/auth";
import { PlayerStore } from "../players";
import { GameServiceMessage, IHandler } from "../shared";
import { StorageManager, localStorageKeys } from "../shared/utils/storage-manager";
import { AuthStore } from "./auth-store";
import { UserService } from "./user-service";

interface AuthorizeResponse {
    errorCode?: string;
    message?: string;
    isSuccessful?: boolean;
    isUM?: boolean;
    umInfo?: UMInfo;
    authorized?: boolean;
    user?: GameServiceMessage.User;
}

interface ISession {
    username: string;
    language: string;
    ss: string;
    time: Date;
    isAuthenticated: boolean;
}

export namespace AuthHandlers {
    @injectable()
    export class SSO implements IHandler<{ token: string; system?: number }> {
        constructor(@inject(AuthStore) private readonly store: AuthStore, @inject(UserService) private readonly userService: UserService) {}

        async handle({ token, system }) {
            const response = await this.userService.sso(token, system);
            if (response.isUM) {
                this.store.setUM(response.umInfo);
                return;
            }

            if (response.isAuthenticated) {
                this.store.setAuthSSOStore(response);
                StorageManager.set(localStorageKeys.session, this.store.getSessionInfo());
                this.clearTokenOnUrl();
            }
        }

        clearTokenOnUrl() {
            try {
                history.pushState(null, "", location.href.split("?")[0]);
            } catch (ex) {
                console.log(ex);
            }
        }
    }

    @injectable()
    export class Authorize implements IHandler<{ session: string; username: string }> {
        constructor(
            @inject(AuthStore) private readonly authStore: AuthStore,
            @inject(PlayerStore) private readonly playerStore: PlayerStore,
            @inject(UserService) private readonly userService: UserService
        ) {}

        async handle({ session = "", username = "" }) {
            const response = (await this.userService.authorize(
                session || this.authStore.session,
                username || this.authStore.username
            )) as AuthorizeResponse;
            if (response.isUM) {
                this.authStore.setUM(response.umInfo);
            } else {
                if (response.isSuccessful !== undefined && !response.isSuccessful) {
                    this.authStore.signOut();
                    StorageManager.remove(localStorageKeys.session);
                } else {
                    this.authStore.isAuthorized = response.authorized;
                    response.user && this.playerStore.setAuthorizeStore(response.user);
                }
            }
        }
    }

    @injectable()
    export class ReCheckIn implements IHandler<{ session: string; username: string }> {
        constructor(
            @inject(AuthStore) private readonly authStore: AuthStore,
            @inject(PlayerStore) private readonly playerStore: PlayerStore,
            @inject(UserService) private readonly userService: UserService
        ) {}

        async handle({ session = "", username = "" }) {
            const response = await this.userService.reCheckIn(session || this.authStore.session, username || this.authStore.username);
            if (response.isSuccessful) {
                this.handleSuccessful(response);
            } else {
                this.authStore.signOut();
            }
        }

        handleSuccessful(response: ReCheckInResponse) {
            if (response.apiError) {
                this.handleError(response);
            } else {
                this.playerStore.setBalance(response.balance, response.scoins, response.availSpins);
            }
        }

        handleError(response: ReCheckInResponse) {
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
        static reCheckInId: NodeJS.Timeout;
        private readonly sessionExpiredTimeoutMinutes = 19.8;
        constructor(@inject(ReCheckIn) private readonly reCheckIn: ReCheckIn, @inject(AuthStore) private readonly authStore: AuthStore) {}

        async handle() {
            this.clearInterval();
            TriggerRecheckIn.reCheckInId = setInterval(() => {
                this.handleRecheckIn();
            }, 60 * 1000);
        }

        async handleRecheckIn() {
            const infoSession = StorageManager.get(localStorageKeys.session) as AuthStore;
            const isSessionExpired = this.verifySession(infoSession);

            if (isSessionExpired) {
                this.authStore.signOut();
            } else {
                await this.reCheckIn.handle({ session: infoSession.session, username: infoSession.username });
            }
        }

        verifySession(infoSession: AuthStore) {
            let isSessionExpired = true;

            try {
                if (infoSession && infoSession.ssoTime) {
                    const now: Date = new Date();
                    const lastRecheckIn: Date = new Date(infoSession.ssoTime);
                    const differenceInMinutes = Math.abs(now.getMinutes() - lastRecheckIn.getMinutes());

                    if (differenceInMinutes <= this.sessionExpiredTimeoutMinutes) {
                        isSessionExpired = false;
                    }
                }
            } catch (ex) {
                console.log(ex);
            }

            return isSessionExpired;
        }

        clearInterval() {
            TriggerRecheckIn.reCheckInId && clearInterval(TriggerRecheckIn.reCheckInId);
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
}
