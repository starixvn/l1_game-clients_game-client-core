import { inject, injectable } from "inversify";
import { ConnectionHandlers } from "../../../game/connection/connection-handlers";
import { GameServiceMessage, IMultipleHandlers } from "../../../shared";
import { CutCardStore } from "./cut-card-store";
import { FairnessStore } from "./fairness-store";

@injectable()
export class CutCardResponseHandlers implements IMultipleHandlers {
    constructor(
        @inject(CutCardStore) protected readonly cutCardStore: CutCardStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore
    ) {}

    handleCutCardResponse(cutCardInfo: GameServiceMessage.CutCard) {
        this.cutCardStore.cutCardInfo = cutCardInfo;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.CutCard.eventName,
            handle: this.handleCutCardResponse,
        },
    ];
}
