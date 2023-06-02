import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { MainPlayerStore } from "../../players";
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
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore
    ) {
        makeAutoObservable(this);
    }

    roundId = 0;
    ownBets: GameServiceMessage.OwnBets = {};
    private _totalBets: GameServiceMessage.TotalBets = {};
    resultHash: GameServiceMessage.ResultHash = {};

    get minBet() {
        return Math.max(this.gameConfigStore.minBet, this.mainPlayerStore.stakeLevel.minBet);
    }

    get maxBet() {
        return Math.min(this.gameConfigStore.maxBet, this.mainPlayerStore.stakeLevel.maxBet);
    }

    get roundOdds() {
        return {
            odds: this.gameConfigStore.odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat,
        };
    }

    set totalBets(totalBets: GameServiceMessage.TotalBets) {
        this._totalBets = totalBets;
    }

    get totalBets() {
        return Object.keys(this._totalBets).reduce((total, betChoice) => {
            total[betChoice] = this._totalBets[betChoice] * this.mainPlayerStore.rate;
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
