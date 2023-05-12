import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { BetStore } from "./bet-store";

@injectable()
export class BetResponseHandlers implements IMultipleHandlers {
    @inject(BetStore) protected readonly store: BetStore;

    handleBetResponse(endBet: number) {
        this.store.isProcessingBet = false;
        this.store.lastReceivedBet = endBet;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.BetResponse.eventName,
            handle: this.handleBetResponse,
        },
    ];
}
