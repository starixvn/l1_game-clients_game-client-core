import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { Bets, RoundStore } from "./round-store";

@injectable()
export class RoundHandlers implements IMultipleHandlers {
    constructor(@inject(RoundStore) protected readonly store: RoundStore) {}

    handleRoundId(roundId: number) {
        if (roundId > 0) {
            this.store.roundId = roundId;
        }
    }

    handleOwnBets(ownBets: Bets) {
        this.store.ownBets = ownBets;
    }

    handleTotalBets(totalBets: Bets) {
        this.store.totalBets = totalBets;
    }

    handleResultHash(resultHash: GameServiceMessage.ResultHash) {
        this.store.resultHash = resultHash;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.roundId,
            handle: this.handleRoundId,
        },
        {
            name: GameServiceMessage.ownBets,
            handle: this.handleOwnBets,
        },
        {
            name: GameServiceMessage.totalBets,
            handle: this.handleTotalBets,
        },
        {
            name: GameServiceMessage.ResultHash.eventName,
            handle: this.handleResultHash,
        },
    ];
}
