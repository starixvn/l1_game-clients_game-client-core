import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { BetStore } from "./bet-store";

@injectable()
export class BetResponseHandlers implements IMultipleHandlers {
    constructor(@inject(BetStore) protected readonly betStore: BetStore) {}

    handleBetResponse(endBet: number) {
        this.betStore.isProcessingBet = false;
        this.betStore.lastReceivedBet = endBet;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.BetResponse.eventName,
            handle: this.handleBetResponse,
        },
    ];
}
