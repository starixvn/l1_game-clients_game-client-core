import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../shared";
import { UMInfo } from "sc-user-service-client/dist/auth";
import { AppStore } from "../app";

@injectable()
export class UndermaintenaceHandlers implements IMultipleHandlers {
    constructor(@inject(AppStore) protected readonly appStore: AppStore) {}

    handleDataKickedOut(umInfo: UMInfo) {
        this.appStore.setUM(umInfo);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.UMInfo.eventName,
            handle: this.handleDataKickedOut,
        },
    ];
}
