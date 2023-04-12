import { inject, injectable } from "inversify";
import { UMInfo } from "sc-user-service-client/dist/auth";
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
                this.store.updateUM(response.umInfo);
            } else {
                this.store.updateAuthSSOStore(response);
            }
        }
    }

    @injectable()
    export class Authorize implements IHandler<void> {
        constructor(
            @inject(AuthStore) private readonly authStore: AuthStore,
            @inject(PlayerStore) private readonly playerStore: PlayerStore,
            @inject(UserService) private readonly userService: UserService
        ) {}

        async handle() {
            const response = (await this.userService.authorize(this.authStore.ss, this.authStore.username)) as AuthorizeResponse;
            if (response.isUM) {
                this.authStore.updateUM(response.umInfo);
            } else {
                if (response.isSuccessful !== undefined && !response.isSuccessful) {
                    this.authStore.isSessionTimeout = true;
                } else {
                    this.authStore.isAuthorized = response.authorized;
                    response.user && this.playerStore.updateAuthorizeStore(response.user);
                }
            }
        }
    }
}
