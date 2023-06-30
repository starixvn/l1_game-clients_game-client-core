import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameSetting } from "../game-configs";

export type RoundTimeSetting = {
    wholeRound: number;
    placingBet: number;
    lockingBet: number;
    generatingResult: number;
    startRound: number;
};

/**
 * Timeline:
 *
 *   Settle                                                                                                 Settle
 *   |                                                                                                        |
 *   V                                                                                                        V
 *   |-------------------------|---------------|------------------|---------------|---------------|-----------|-------------------------|
 *   |  SHOW_ANIMATION_RESULT  |  SHOW_RESULT  |  STARTING_ROUND  |  PLACING_BET  |  LOCKING_BET  |  WAITING  |  SHOW_ANIMATION_RESULT  |
 *   |-------------------------|---------------|------------------|---------------|---------------|-----------|-------------------------|
 *   |         in 2s           |               |      in 1s       |               |               |           |
 *   39 Whole round           37              31                  30              5               0       0...|... 39 Whole round
 */

export const ROUND_STATE = {
    START_GAME_LOOP: "startGameLoop",
    STARTING_ROUND: "startingRound",
    PLACING_BET: "placingBet",
    LOCKING_BET: "lockingBet",
    WAITING: "waiting",
    SHOW_ANIMATION_RESULT: "showAnimationResult",
    SHOW_RESULT: "showResult",
    CHANGE_REMAINING_TIME: "changeRemainingTime",
    STOP_GAME_LOOP: "stopGameLoop",
    NONE: "none",
};

@injectable()
export class RoundTimeStore {
    wholeRound = 0;
    placingBet = 0;
    lockingBet = 0;
    genResult = 0;
    startRound = 0;
    private _roundTime = 0;
    private _roundState = ROUND_STATE.NONE;
    private _countdownTimer = 0;
    private _remaining = 0;
    startNewRound = false;
    endRound = false;
    startPlacingBet = false;
    endPlacingBet = false;

    constructor(@inject(GameSetting) gameSetting: GameSetting) {
        makeAutoObservable(this);
        this.setRoundTimeSetting(gameSetting.durations as RoundTimeSetting);
    }

    get isWaiting() {
        return this.roundTime > this.placingBet && this.wholeRound !== 0 && this.roundTime !== 0;
    }

    get isStartWaiting() {
        return this.roundTime === this.wholeRound && this.wholeRound !== 0;
    }

    get isLocking() {
        return this.roundTime <= this.lockingBet && this.wholeRound !== 0 && this.roundTime !== 0;
    }

    get isStaringLocking() {
        return this.roundTime === this.lockingBet && this.wholeRound !== 0;
    }

    get isPlacingBet() {
        return this.roundTime <= this.placingBet && this.roundTime > this.lockingBet && this.wholeRound !== 0;
    }

    get isStartPlacingBet() {
        return this.roundTime === this.placingBet && this.wholeRound !== 0;
    }

    get isShowAnimationResult() {
        return (this.roundTime <= this.wholeRound && this.roundTime > this.wholeRound - this.genResult) || this.roundTime === 0;
    }

    get isBeginShowResult() {
        return this.roundTime === this.wholeRound - this.genResult + 1 && this.wholeRound !== 0;
    }

    get isShowResult() {
        return (
            this.roundTime <= this.wholeRound - this.genResult + 1 &&
            this.roundTime > this.placingBet + this.startRound &&
            this.wholeRound !== 0
        );
    }

    get isStartGenerateResult() {
        return this.roundTime === this.placingBet + this.genResult;
    }

    get isStartingRound() {
        return this.roundTime <= this.placingBet + this.startRound && this.roundTime > this.placingBet && this.wholeRound !== 0;
    }

    get isTimeOut() {
        return this.roundTime === 0;
    }

    get isInRoundTime() {
        return this.roundState === ROUND_STATE.PLACING_BET || this.roundState === ROUND_STATE.LOCKING_BET;
    }

    get isShowDisabledGameMessage() {
        return this._roundTime <= this.placingBet;
    }

    get isDisplayingResultState() {
        return (
            this.roundState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundState === ROUND_STATE.SHOW_RESULT ||
            this.roundState === ROUND_STATE.STOP_GAME_LOOP
        );
    }

    resetRoundTime() {
        this._roundTime = this.wholeRound;
    }

    setRoundTimeSetting(setting: RoundTimeSetting) {
        this.wholeRound = setting.wholeRound;
        this.placingBet = setting.placingBet;
        this.lockingBet = setting.lockingBet;
        this.genResult = setting.generatingResult;
        this.startRound = setting.startRound;
    }

    countdown() {
        if (this.roundTime <= 1) {
            this.roundTime = 0;
        } else {
            this.roundTime--;
        }
    }

    get roundTime() {
        return this._roundTime;
    }

    set roundTime(roundTime) {
        this._roundTime = roundTime;
        this.calculateRoundStatus();
    }

    get remaining() {
        return this._remaining;
    }

    get roundState() {
        return this._roundState;
    }

    set roundState(value: string) {
        this._roundState = value;
    }

    get countdownTimer() {
        return this._countdownTimer;
    }

    calculateRoundStatus() {
        this.roundState = this.getCurrentRoundState();
        if (this.roundTime < 0) {
            return;
        }

        if (this.isWaiting) {
            this._remaining = this.roundTime - this.placingBet;
        }

        if (this.isShowAnimationResult) {
            this._remaining = this.genResult;
        }

        if (this.isShowResult) {
            const duration = this.roundTime - this.placingBet - this.genResult;
            this._remaining = duration;
            this._countdownTimer = duration;
        }

        if (this.isStartingRound) {
            this._remaining = this.startRound;
        }

        if (this.isPlacingBet) {
            this._remaining = this.roundTime - this.lockingBet;
            this._countdownTimer = this.roundTime;
        }

        if (this.isLocking) {
            this._remaining = this.roundTime;
            this._countdownTimer = this.roundTime;
        }
    }

    getCurrentRoundState(): string {
        if (this.roundTime < 0) {
            return ROUND_STATE.WAITING;
        }

        let currentState = "";
        if (this.isWaiting) {
            currentState = ROUND_STATE.WAITING;
        }

        if (this.isShowAnimationResult) {
            currentState = ROUND_STATE.SHOW_ANIMATION_RESULT;
        }

        if (this.isShowResult) {
            currentState = ROUND_STATE.SHOW_RESULT;
        }

        if (this.isStartingRound) {
            currentState = ROUND_STATE.STARTING_ROUND;
        }

        if (this.isPlacingBet) {
            currentState = ROUND_STATE.PLACING_BET;
        }

        if (this.isLocking) {
            currentState = ROUND_STATE.LOCKING_BET;
        }
        return currentState;
    }

    start() {
        this.roundState = ROUND_STATE.START_GAME_LOOP;
    }

    resetRoundTimeStore() {
        this.roundState = ROUND_STATE.STOP_GAME_LOOP;
    }
}
