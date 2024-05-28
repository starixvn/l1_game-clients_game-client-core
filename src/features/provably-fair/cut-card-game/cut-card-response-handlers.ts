import { inject, injectable } from "inversify";
import { ConnectionHandlers } from "../../../game/connection/connection-handlers";
import { GameServiceMessage, IMultipleHandlers } from "../../../shared";
import { CutCardStore } from "./cut-card-store";

@injectable()
export class CutCardResponseHandlers implements IMultipleHandlers {
    constructor(
        @inject(CutCardStore) protected readonly fairnessStore: CutCardStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler
    ) {}

    handleCutCardResponse(cutCardInfo: GameServiceMessage.CutCard) {
        this.fairnessStore.cutCardInfo = cutCardInfo;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.CutCard.eventName,
            handle: this.handleCutCardResponse,
        },
    ];
}
