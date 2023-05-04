import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../shared";
import { UMInfo } from "sc-user-service-client/dist/auth";
import { AuthStore } from "../auth/auth-store";

@injectable()
export class UndermaintenaceHandlers implements IMultipleHandlers {
    constructor(@inject(AuthStore) protected readonly authStore: AuthStore) {}

    handleDataKickedOut(umInfo: UMInfo) {
        this.authStore.setUM(umInfo);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.UMInfo.eventName,
            handle: this.handleDataKickedOut,
        },
    ];
}
