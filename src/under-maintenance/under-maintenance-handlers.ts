import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../shared";
import { AppStore } from "../app";

@injectable()
export class UndermaintenaceHandlers implements IMultipleHandlers {
    constructor(@inject(AppStore) protected readonly appStore: AppStore) {}

    handleDataKickedOut(umInfo: GameServiceMessage.UMInfo) {
        this.appStore.setUM(umInfo);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.UMInfo.eventName,
            handle: this.handleDataKickedOut,
        },
    ];
}
