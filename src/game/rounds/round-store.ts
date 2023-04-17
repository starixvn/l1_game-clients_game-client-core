import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";
import { GameConfigStore } from "../game-configs";
import { PlayerStore } from "../../players";

export type Bets = {
    [betChoice: string]: number;
};
@injectable()
export class RoundStore {
    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(PlayerStore) protected readonly playerStore: PlayerStore
    ) {
        makeAutoObservable(this);
    }

    roundId: number = 0;
    ownBets: Bets = {};
    totalBets: Bets = {};
    resultHash: GameServiceMessage.ResultHash = {};

    get minBet() {
        return Math.max(this.gameConfigStore.minBet, this.playerStore.stakeLevel.minBet);
    }

    get maxBet() {
        return Math.min(this.gameConfigStore.maxBet, this.playerStore.stakeLevel.maxBet);
    }

    resetForNewRound() {
        this.ownBets = {};
        this.totalBets = {};
    }
}
