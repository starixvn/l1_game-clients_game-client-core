import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { ConnectionHandlers } from "../connection";
import { RoundTimeStore } from "../rounds";
import { BetStore } from "./bet-store";

@injectable()
export class BetResponseHandlers implements IMultipleHandlers {
    constructor(
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler
    ) {
        reaction(
            () => this.roundTimeStore.isWaiting,
            (isWaiting) => isWaiting && this.stopProcessingBetAndClearInterval()
        );
        reaction(
            () => this.roundTimeStore.isStartPlacingBet,
            (isStartPlacingBet) => isStartPlacingBet && this.resetIsReceivedBet()
        );
    }

    handleBetResponse(endBet: number) {
        this.stopProcessingBetAndClearInterval();
        this.betStore.lastReceivedBet = { value: endBet };
        this.betStore.isReceivedBet = endBet > 0;
    }

    stopProcessingBetAndClearInterval() {
        this.betStore.isProcessingBet = false;
        this.retryGameHandler.clearInterval();
    }

    resetIsReceivedBet() {
        this.betStore.isReceivedBet = false;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.BetResponse.eventName,
            handle: this.handleBetResponse,
        },
    ];
}
