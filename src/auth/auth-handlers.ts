import { inject, injectable } from "inversify";
import { ReCheckInResponse, UMInfo } from "sc-user-service-client/dist/auth";
import { PlayerStore } from "../players";
import { GameServiceMessage, IHandler } from "../shared";
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

export namespace AuthHandlers {
    @injectable()
    export class SSO implements IHandler<{ token: string; system?: number }> {
        constructor(@inject(AuthStore) private readonly store: AuthStore, @inject(UserService) private readonly userService: UserService) {}

        async handle({ token, system }) {
            const response = await this.userService.sso(token, system);
            if (response.isUM) {
                this.store.setUM(response.umInfo);
            } else {
                this.store.setAuthSSOStore(response);
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
                if (response.apiError) {
                    this.handleError(response);
                } else {
                    this.playerStore.setBalance(response.balance, response.scoins, response.availSpins);
                }
            } else {
                this.authStore.signOut();
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
