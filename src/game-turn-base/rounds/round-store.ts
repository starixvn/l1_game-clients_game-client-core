import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared";
import { GameConfigStore } from "../../game/game-configs";
import { RoundHistoryStore } from "../../game/round-histories";
import { SettlementStore } from "../../game/settlements";
import { ROUND_STATE, RoundTimeStore } from "./round-time-store";
import { Turn } from "./round-handlers";

export type Bets = {
    [betChoice: string]: number;
};

export type RoundOdds = {
    odds: GameServiceMessage.Odds;
    fractional: boolean;
};

export interface THighlightAnim {
    isAnim: boolean;
    settlementResult: GameServiceMessage.TSettlementResult;
}

export interface THighlightStatic {
    settlementResult: GameServiceMessage.TSettlementResult;
    result: GameServiceMessage.TResult;
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

    drawId = 0;
    _roundId = 0;
    private _ownBets: GameServiceMessage.OwnBets = {};
    private _totalBets: GameServiceMessage.TotalBets = {};
    private _odds: GameServiceMessage.Odds = {};
    resultHash: GameServiceMessage.ResultHash = null;
    private _userBetPercentage: GameServiceMessage.UserBetPercentage = null;
    private _betPercentage: GameServiceMessage.UserBetPercentage = {};
    private _turnCounter = 1;

    _clientRoundId = 0;


    private _turnObject: Turn = null;

    set turnObject(turnObject: Turn) {
        this._turnObject = turnObject;
    }

    get turnObject() {
        return this._turnObject;
    }

    set roundId(roundId: number) {
        this._roundId = roundId;
    }

    get roundId() {
        return this._roundId;
    }


    set turnCounter(turnCounter: number) {
        this._turnCounter = turnCounter;
    }

    get turnCounter() {
        return this._turnCounter;
    }

    set clientRoundId(drawId: number) {
        this._clientRoundId = drawId;
    }

    get clientRoundId() {
        const currentFinish = this.settlementStore.currentFinish;
        if (!currentFinish || this.historyRoundId >= currentFinish.drawId) {
            return this.historyRoundId;
        }
        return currentFinish.drawId;
    }

    get historyRoundId() {
        let lastRoundId = 0;

        if (this.roundHistoryStore.histories.length > 0) {
            lastRoundId = this.roundHistoryStore.histories[0].drawId;
        }

        if (
            this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND ||
            this.roundTimeStore.roundState === ROUND_STATE.PLACING_BET ||
            this.roundTimeStore.roundState === ROUND_STATE.LOCKING_BET ||
            this.roundTimeStore.roundState === ROUND_STATE.WAITING
        ) {
            lastRoundId++;
        }

        // when clearing all active data in database and having data in archive collection
        if (this.roundHistoryStore.histories.length === 0 && this.drawId > 0) {
            lastRoundId = this.drawId;
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


    set Odds(odds: GameServiceMessage.Odds) {
        this._odds = odds;
    }


    get Odds() {
        return this._odds;
    }



    get roundOdds(): RoundOdds {
        return {
            odds: this._odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat
        }
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

    set userBetPercentage(betPercent: GameServiceMessage.UserBetPercentage) {
        this._userBetPercentage = betPercent;
    }

    get userBetPercentage() {
        return this._userBetPercentage;
    }

    set betPercentage(betPercent: GameServiceMessage.BetPercentage) {
        this._betPercentage = betPercent;
    }

    get betPercentage() {
        return this._betPercentage;
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

    get highLightAnim(): THighlightAnim {
        const isAnim = this.settlementStore.isFinishedShowResult;
        const settlementResult = this.roundHistoryStore?.getLastRound()?.settlementResult;

        return {
            isAnim,
            settlementResult,
        };
    }

    get highlightStatic(): THighlightStatic {
        let settlementResult: GameServiceMessage.TSettlementResult = null;
        let result: GameServiceMessage.TResult = null;
        if (this.roundTimeStore.isPlacingBet || this.roundTimeStore.isStartingRound) {
            const lastRound = this.roundHistoryStore?.getLastRound();
            settlementResult = lastRound?.settlementResult;
            result = lastRound?.result;
        }

        return { settlementResult, result };
    }

    resetForNewRound() {
        this.ownBets = {};
        this._totalBets = {};
        this._userBetPercentage = null;
        this._betPercentage = {};
    }

    resetRoundStore() {
        this.resetForNewRound();
        this.resultHash = null;
    }
}
