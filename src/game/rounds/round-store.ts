import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared";
import { GameConfigStore } from "../game-configs";
import { RoundHistoryStore } from "../round-histories";
import { SettlementStore } from "../settlements";
import { ROUND_STATE, RoundTimeStore } from "./round-time-store";

export type Bets = {
    [betChoice: string]: number;
};

export type RoundOdds = {
    odds: GameServiceMessage.Odds;
    fractional: boolean;
};

export interface THighLightInfo {
    isAnim: boolean;
    settlementResult: GameServiceMessage.TSettlementResult;
}

export interface THighLightBorder {
    settlementResult: GameServiceMessage.TSettlementResult;
}

@injectable()
export class RoundStore {
    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore
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

    set clientRoundId(roundId: number) {
        this._clientRoundId = roundId;
    }

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
            this.clientRoundId = lastRoundId;
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
            total[betChoice] = this._totalBets[betChoice] / this.mainPlayerStore.rate;
            return total;
        }, {});
    }

    get ownBets() {
        return this._ownBets;
    }

    set ownBets(ownBets: GameServiceMessage.OwnBets) {
        this._ownBets = ownBets;
    }

    get isResetHighlight(): boolean {
        let isResetHighlight = false;

        switch (this.roundTimeStore.roundState) {
            case ROUND_STATE.LOCKING_BET:
            case ROUND_STATE.STOP_GAME_LOOP:
            case ROUND_STATE.SHOW_ANIMATION_RESULT:
                isResetHighlight = true;
                break;
        }

        return isResetHighlight;
    }

    get highLightAnim(): THighLightInfo {
        const isAnim = this.settlementStore.isFinishedShowResult;
        const settlementResult = this.roundHistoryStore?.getLastRound()?.settlementResult;

        return {
            isAnim,
            settlementResult,
        };
    }

    get highLightBorder(): THighLightBorder {
        let settlementResult: GameServiceMessage.TSettlementResult = null;
        const isFinishedShowResult = this.settlementStore.isFinishedShowResult;
        if (
            this.roundTimeStore.roundState === ROUND_STATE.PLACING_BET ||
            this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND ||
            isFinishedShowResult
        ) {
            settlementResult = this.roundHistoryStore?.getLastRound()?.settlementResult;
        }

        return { settlementResult };
    }

    get isAnimBlink() {
        let isAnimBlink = false;
        if (!this.settlementStore.isFinishedShowResult && this.roundTimeStore.isLocking) {
            isAnimBlink = true;
        }
        return isAnimBlink;
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
