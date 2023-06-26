import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared";
import { GameConfigStore } from "../game-configs";
import { RoundHistoryStore } from "../round-histories";
import { ROUND_STATE, RoundTimeStore } from "./round-time-store";

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
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore
    ) {
        makeAutoObservable(this, {
            _clientRoundId: false,
        });
    }

    roundId = 0;
    private _ownBets: GameServiceMessage.OwnBets = {};
    private _totalBets: GameServiceMessage.TotalBets = {};
    resultHash: GameServiceMessage.ResultHash = {};

    _clientRoundId = 0;

    get clientRoundId() {
        let lastRoundId = 0;

        if (this.roundHistoryStore.histories.length > 0) {
            lastRoundId = this.roundHistoryStore.histories[0].roundId;
        }

        if (
            this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND ||
            this.roundTimeStore.roundState === ROUND_STATE.PLACING_BET ||
            this.roundTimeStore.roundState === ROUND_STATE.LOCKING_BET ||
            this.roundTimeStore.roundState === ROUND_STATE.WAITING
        ) {
            lastRoundId++;
        }

        if (this._clientRoundId < lastRoundId) {
            this._clientRoundId = lastRoundId;
        }
        return this._clientRoundId;
    }

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

    get ownBets() {
        return this._ownBets;
    }

    set ownBets(ownBets: GameServiceMessage.OwnBets) {
        this._ownBets = ownBets;
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
