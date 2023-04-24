import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { RoundTimeStore } from "./round-time-store";

@injectable()
export class RoundTimeHandlers implements IMultipleHandlers {
    constructor(@inject(RoundTimeStore) protected readonly store: RoundTimeStore) {}

    handleRemainingTime(remainingTime: number) {
        if (remainingTime > 0) {
            this.store.roundTime = remainingTime;
            this.store.start();
        }
    }

    handleStartNewRoundStatus(snr: boolean) {
        this.store.startNewRound = snr;
    }

    handleStartPlacingBetStatus(spb: boolean) {
        this.store.startPlacingBet = spb;
    }

    handleEndPlacingBetStatus(epb: boolean) {
        this.store.endPlacingBet = epb;
    }

    handleEndRoundStatus(finish: GameServiceMessage.Finish) {
        if (finish) {
            this.store.endRound = true;
            this.store.endPlacingBet = false;
            this.store.startPlacingBet = false;
        }
    }

    eventHandleList = [
        {
            name: GameServiceMessage.remainingTime,
            handle: this.handleRemainingTime,
        },
        {
            name: GameServiceMessage.snr,
            handle: this.handleStartNewRoundStatus,
        },
        {
            name: GameServiceMessage.spb,
            handle: this.handleStartPlacingBetStatus,
        },
        {
            name: GameServiceMessage.epb,
            handle: this.handleEndPlacingBetStatus,
        },
        {
            name: GameServiceMessage.Finish.eventName,
            handle: this.handleEndRoundStatus,
        },
    ];
}
