import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameSetting } from "../game-configs";

export type RoundTimeSetting = {
    wholeRound: number;
    placingBet: number;
    lockingBet: number;
    generatingResult: number;
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
    BEGIN_SHOW_ANIMATION: "beginShowAnimation",
    SHOW_ANIMATION: "showAnimation",
    CHANGE_REMAINING_TIME: "changeRemainingTime",
    STOP_GAME_LOOP: "stopGameLoop",
};

@injectable()
export class RoundTimeStore {
    wholeRound = 0;
    placingBet = 0;
    lockingBet = 0;
    genResult = 0;
    _roundTime = 0;
    _roundState = ROUND_STATE.STARTING_ROUND;
    _beginState = "";

    _isLockingBet: boolean;
    _isPlacingBet: boolean;
    _isWaiting: boolean;
    _isStartGameLoop: boolean;
    _isStopGameLoop: boolean;

    _duration: number;
    _remaining: number;

    startNewRound = false;
    endRound = false;
    startPlacingBet = false;
    endPlacingBet = false;

    overrideEvent: {
        name: string;
        remaining: number;
        duration: number;
    };

    constructor(@inject(GameSetting) gameSetting: GameSetting) {
        makeAutoObservable(this);
        this.setRoundTimeSetting(gameSetting.durations as RoundTimeSetting);
    }

    get isWaiting() {
        return this._roundTime > this.placingBet && this.wholeRound !== 0;
    }

    get isStartWaiting() {
        return this._roundTime === this.wholeRound && this.wholeRound !== 0;
    }

    get isLocking() {
        return this._roundTime <= this.lockingBet && this.wholeRound !== 0;
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

    get isBeforePlacingBet() {
        return this._roundTime > this.placingBet;
    }

    setRoundTimeSetting(setting: RoundTimeSetting) {
        this.wholeRound = setting.wholeRound;
        this.placingBet = setting.placingBet;
        this.lockingBet = setting.lockingBet;
        this.genResult = setting.generatingResult;
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
        this.calculateBeginStatus();
    }

    get roundState() {
        return this._roundState;
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
        if (this._roundTime < 0) {
            this._roundState = ROUND_STATE.WAITING;
            return;
        }

        this.calculateBeginStatus();

        if (this.isWaiting) {
            this._isWaiting = true;
            this._roundState = ROUND_STATE.WAITING;
            this._remaining = this._roundTime - this.placingBet;
            this._duration = this.wholeRound - this._roundTime;
        }

        if (this.isLocking) {
            this._isLockingBet = true;
            this._roundState = ROUND_STATE.LOCKING_BET;
            this._duration = this.wholeRound - this._roundTime;
            this._remaining = this._roundTime;
        }

        if (this.isPlacingBet) {
            this._isPlacingBet = true;
            this._roundState = ROUND_STATE.PLACING_BET;
            this._remaining = this._roundTime - this.lockingBet;
            this._duration = this.placingBet - this._roundTime;
        }
    }

    start() {
        this._isStartGameLoop = true;
    }

    stop() {
        this._isStopGameLoop = true;
    }
}
