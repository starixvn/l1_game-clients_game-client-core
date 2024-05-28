import { inject, injectable } from "inversify";
import { ConnectionHandlers } from "../../../game/connection/connection-handlers";
import { GameServiceMessage, IMultipleHandlers } from "../../../shared";
import { FairnessStore } from "./fairness-store";

@injectable()
export class CutCardResponseHandlers implements IMultipleHandlers {
    constructor(
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
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
