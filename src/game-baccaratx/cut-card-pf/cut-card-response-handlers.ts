import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { FairnessStore } from "./fairness-store";

@injectable()
export class CutCardResponseHandlers implements IMultipleHandlers {
    constructor(@inject(FairnessStore) protected readonly fairnessStore: FairnessStore) {}

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
