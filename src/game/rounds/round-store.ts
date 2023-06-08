import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { PlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared";
import { GameConfigStore } from "../game-configs";

export type Bets = {
    [betChoice: string]: number;
};

export type RoundOdds = {
    odds: GameServiceMessage.Odds;
    fractional: boolean;
};

@injectable()
export class RoundStore {
    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(PlayerStore) protected readonly playerStore: PlayerStore
    ) {
        makeAutoObservable(this);
    }

    roundId = 0;
    ownBets: GameServiceMessage.OwnBets = {};
    private _totalBets: GameServiceMessage.TotalBets = {};
    resultHash: GameServiceMessage.ResultHash = {};

    get minBet() {
        return Math.max(this.gameConfigStore.minBet, this.playerStore.stakeLevel.minBet);
    }

    get maxBet() {
        return Math.min(this.gameConfigStore.maxBet, this.playerStore.stakeLevel.maxBet);
    }

    get roundOdds() {
        return {
            odds: this.gameConfigStore.odds,
            fractional: this.playerStore.fractionalOddsFormat,
        };
    }

    set totalBets(totalBets: GameServiceMessage.TotalBets) {
        this._totalBets = totalBets;
    }

    get totalBets() {
        return Object.keys(this._totalBets).reduce((total, betChoice) => {
            total[betChoice] = this._totalBets[betChoice] * this.playerStore.rate;
            return total;
        }, {});
    }

    resetForNewRound() {
        this.ownBets = {};
        this._totalBets = {};
    }

    resetRoundStore() {
        this.resetForNewRound();
        this.resultHash = {};
    }
}
