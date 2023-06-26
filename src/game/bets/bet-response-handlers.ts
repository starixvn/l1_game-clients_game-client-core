import { inject, injectable } from "inversify";
import { when } from "mobx";
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
        when(
            () => this.roundTimeStore.isWaiting === true,
            () => {
                this.stopProcessingBetAndClearInterval();
            }
        );
    }

    handleBetResponse(endBet: number) {
        this.stopProcessingBetAndClearInterval();
        this.betStore.lastReceivedBet = { value: endBet };
    }

    stopProcessingBetAndClearInterval() {
        this.betStore.isProcessingBet = false;
        this.retryGameHandler.clearInterval();
    }

    eventHandleList = [
        {
            name: GameServiceMessage.BetResponse.eventName,
            handle: this.handleBetResponse,
        },
    ];
}
