import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameSetting } from "../game-configs";
import { RoundHistory } from "../round-histories";

export type RoundTimeSetting = {
    wholeRound: number;
    placingBet: number;
    lockingBet: number;
    generatingResult: number;
    startRound: number;
};

export const ROUND_STATE = {
    START_GAME_LOOP: "startGameLoop",
    BEGIN_STARTING_ROUND: "beginStartingRound",
    STARTING_ROUND: "startingRound",
    BEGIN_PLACING_BET: "beginPlacingBet",
    PLACING_BET: "placingBet",
    BEGIN_LOCKING_BET: "beginLockingBet",
    LOCKING_BET: "lockingBet",
    BEGIN_WAITING: "beginWaiting",
    WAITING: "waiting",
    SHOW_ANIMATION_RESULT: "showAnimationResult",
    BEGIN_SHOW_RESULT: "beginShowResult",
    SHOW_RESULT: "showResult",
    CHANGE_REMAINING_TIME: "changeRemainingTime",
    STOP_GAME_LOOP: "stopGameLoop",
};

export type TJoinRoomInfo = {
    roundHistory: RoundHistory;
    joinGameState: string;
};

@injectable()
export class RoundTimeStore {
    wholeRound = 0;
    placingBet = 0;
    lockingBet = 0;
    genResult = 0;
    startRound = 0;
    private _roundTime = 0;
    private _roundState = ROUND_STATE.WAITING;
    private _beginState = "";
    private _countdownTimer = 0;
    private _remaining = 0;
    startNewRound = false;
    endRound = false;
    startPlacingBet = false;
    endPlacingBet = false;
    joinGameState = "";

    constructor(@inject(GameSetting) gameSetting: GameSetting) {
        makeAutoObservable(this);
        this.setRoundTimeSetting(gameSetting.durations as RoundTimeSetting);
    }

    get isWaiting() {
        return this._roundTime > this.placingBet && this.wholeRound !== 0 && this._roundTime !== 0;
    }

    get isStartWaiting() {
        return this._roundTime === this.wholeRound && this.wholeRound !== 0;
    }

    get isLocking() {
        return this._roundTime <= this.lockingBet && this.wholeRound !== 0 && this._roundTime !== 0;
    }

    get isStaringLocking() {
        return this._roundTime === this.lockingBet && this.wholeRound !== 0;
    }

    get isPlacingBet() {
        return this._roundTime <= this.placingBet && this._roundTime > this.lockingBet && this.wholeRound !== 0;
    }

    get isStartPlacingBet() {
        return this._roundTime === this.placingBet && this.wholeRound !== 0;
    }

    get isShowAnimationResult() {
        return (this._roundTime <= this.wholeRound && this._roundTime > this.wholeRound - this.genResult) || this._roundTime === 0;
    }

    get isBeginShowResult() {
        return this._roundTime === this.wholeRound - this.genResult + 1 && this.wholeRound !== 0;
    }

    get isShowResult() {
        return (
            this._roundTime <= this.wholeRound - this.genResult + 1 &&
            this._roundTime > this.placingBet + this.startRound &&
            this.wholeRound !== 0
        );
    }

    get isStartGenerateResult() {
        return this._roundTime === this.placingBet + this.genResult;
    }

    get isStartingRound() {
        return this._roundTime <= this.placingBet + this.startRound && this._roundTime > this.placingBet && this.wholeRound !== 0;
    }

    get isTimeOut() {
        return this._roundTime === 0;
    }

    get isInRoundTime() {
        return (
            this.roundState === ROUND_STATE.BEGIN_PLACING_BET ||
            this.roundState === ROUND_STATE.PLACING_BET ||
            this.roundState === ROUND_STATE.BEGIN_LOCKING_BET ||
            this.roundState === ROUND_STATE.LOCKING_BET
        );
    }

    get isStopGame() {
        return this.roundState === ROUND_STATE.STOP_GAME_LOOP;
    }

    setRoundTimeSetting(setting: RoundTimeSetting) {
        this.wholeRound = setting.wholeRound;
        this.placingBet = setting.placingBet;
        this.lockingBet = setting.lockingBet;
        this.genResult = setting.generatingResult;
        this.startRound = setting.startRound;
    }

    countdown() {
        if (this._roundTime <= 1) {
            this._roundTime = 0;
        } else {
            this._roundTime--;
        }

        this.calculateRoundStatus();
    }

    get roundTime() {
        return this._roundTime;
    }

    set roundTime(roundTime: number) {
        this._roundTime = roundTime;
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

    get beginState() {
        return this._beginState;
    }

    get countdownTimer() {
        return this._countdownTimer;
    }

    calculateBeginStatus() {
        if (this.isStartPlacingBet && this._beginState !== ROUND_STATE.BEGIN_PLACING_BET) {
            this._beginState = ROUND_STATE.BEGIN_PLACING_BET;
        }

        if (this.isStaringLocking && this._beginState !== ROUND_STATE.BEGIN_LOCKING_BET) {
            this._beginState = ROUND_STATE.BEGIN_LOCKING_BET;
        }

        if (this.isStartWaiting && this._beginState !== ROUND_STATE.BEGIN_WAITING) {
            this._beginState = ROUND_STATE.BEGIN_WAITING;
        }
    }

    calculateRoundStatus() {
        this._roundState = this.getCurrentRoundState();
        if (this._roundTime < 0) {
            return;
        }

        this.calculateBeginStatus();

        if (this.isWaiting) {
            this._remaining = this._roundTime - this.placingBet;
        }

        if (this.isShowAnimationResult) {
            this._remaining = this.genResult;
        }

        if (this.isShowResult) {
            const duration = this._roundTime - this.placingBet - this.genResult;
            this._remaining = duration;
            this._countdownTimer = duration;
        }

        if (this.isStartingRound) {
            this._remaining = this.startRound;
        }

        if (this.isPlacingBet) {
            this._remaining = this._roundTime - this.lockingBet;
            this._countdownTimer = this._roundTime;
        }

        if (this.isLocking) {
            this._remaining = this._roundTime;
            this._countdownTimer = this._roundTime;
        }
    }

    getCurrentRoundState(): string {
        if (this._roundTime < 0) {
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

    setJoinGameState() {
        this.joinGameState = this.getCurrentRoundState();
    }

    start() {
        this._roundState = ROUND_STATE.START_GAME_LOOP;
    }

    stop() {
        this._roundState = ROUND_STATE.STOP_GAME_LOOP;
    }
}
