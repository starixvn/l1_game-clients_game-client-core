import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameSetting, TurnBaseDurationSetting } from "../../game/game-configs";

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
    SWITCH_ROUND: "SwitchRound"
};

const RoundTimeInitValue = -99999;

@injectable()
export class RoundTimeStore {
    private _totalRoundTime = RoundTimeInitValue;
    private _roundTime = RoundTimeInitValue;
    private _roundState = ROUND_STATE.NONE;
    private _countdownTimer = 0;
    private _remaining = 0;
    private _durations: TurnBaseDurationSetting = null;
    startNewRound = false;
    endRound = false;
    startPlacingBet = false;
    endPlacingBet = false;
    durationShowPromptMessage = 2;

    constructor(@inject(GameSetting) readonly gameSetting: GameSetting) {
        makeAutoObservable(this);
        this.setDurationShowPromptMessage(gameSetting?.durationShowPromptMessage);
        this._durations = this.gameSetting.durations as TurnBaseDurationSetting
    }

    get TotalTurns() {
        return this._durations.wholeTurn || 1;
    }

    get wholeTurn() {
        return this._durations.wholeTurn || 0;
    }
    get wholeRound() {
        return this._durations.wholeRound;
    }
    get placingBet() {
        return this._durations.placingBet;
    }
    get lockingBet() {
        return this._durations.lockingBet;
    }
    get generatingResult() {
        return this._durations.generatingResult;
    }
    get showingResult() {
        return this._durations.showingResult;
    }
    get startRound() {
        return this._durations.startRound;
    }

    get switchRoundAnimation() {
        return this._durations.switchRoundAnimation;
    }

    get initialized() {
        return this.roundTime !== RoundTimeInitValue;
    }

    get isWaiting() {
        return this.roundTime > this.placingBet;
    }

    get isStartWaiting() {
        return this.roundTime === this.wholeTurn;
    }

    get isLocking() {
        return this.roundTime <= this.lockingBet && this.roundTime > 0;
    }

    get isStartLocking() {
        return this.roundTime === this.lockingBet;
    }

    get isPlacingBet() {
        return this.roundTime <= this.placingBet && this.roundTime > this.lockingBet;
    }

    get isStartPlacingBet() {
        return this.roundTime === this.placingBet;
    }

    get isShowAnimationResult() {
        return (this.roundTime <= this.wholeTurn && this.roundTime > this.wholeTurn - this.generatingResult) || this.roundTime === 0;
    }

    get isShowResult() {
        return (
            this.roundTime <= this.wholeTurn - this.generatingResult + 1 &&
            this.roundTime > this.placingBet + this.startRound &&
            this.wholeTurn !== 0
        );
    }

    get isStartRound() {
        return this.roundTime === this.placingBet + this.startRound;
    }

    get isStartingRound() {
        return this.roundTime <= this.placingBet + this.startRound && this.roundTime > this.placingBet;
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

    get isVisibleReBet() {
        return this.isStartingRound || this.isLocking || this.isWaiting;
    }

    get isShowStartBetMessage() {
        return this.roundTime <= this.placingBet + this.durationShowPromptMessage && this.roundTime > this.placingBet;
    }

    get totalRoundTime() {
        return this._totalRoundTime;
    }

    set totalRoundTime(totalRoundTime) {
        this._totalRoundTime = totalRoundTime;
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

    resetRoundTime() {
        this._roundTime = this.wholeTurn;
    }

    setDurationShowPromptMessage(durationShowPromptMessage?: number) {
        durationShowPromptMessage && (this.durationShowPromptMessage = durationShowPromptMessage);
    }

    get isSwitchRoundInTurn() {
        if (this.wholeRound > 0) {
            const startSwitchRoundPointTime = this.wholeRound - this.showingResult;
            const endSwitchRoundPointTime = startSwitchRoundPointTime - this.switchRoundAnimation;
            // console.log({ startSwitchRoundPointTime, endSwitchRoundPointTime, remainingTime: this._remaining, roundTime: this.roundTime });

            if (startSwitchRoundPointTime >= this.totalRoundTime && this.totalRoundTime > endSwitchRoundPointTime) {

                // console.log({ remaining: this._remaining });
                // console.log({ roundTime: this.roundTime });
                // console.log("%cisSwitchRoundInTurn", "color: red; font-size:18px; font-weight: bold");
                return true;
            }
        }

        return false;
    }

    getRemainingTime(totalRoundTime: number): number {
        const turnRemainingTime =
            this.getRoundRemainingTimeToCalculateTurnRemainingTime(totalRoundTime) % this._durations.wholeTurn;

        // console.log(`turn base RemainingTime: ${turnRemainingTime}`)

        return turnRemainingTime <= 0 ? this._durations.wholeTurn : turnRemainingTime;
    }

    getRoundRemainingTimeToCalculateTurnRemainingTime(remainingTime: number): number {
        const { wholeRound, showingResult, switchRoundAnimation, startRound } = this._durations;
        const startSwitchRoundPointTime = wholeRound - showingResult;
        const endSwitchRoundPointTime = startSwitchRoundPointTime - switchRoundAnimation;

        if (remainingTime > startSwitchRoundPointTime) {
            return remainingTime - switchRoundAnimation;
        }

        if (startSwitchRoundPointTime >= remainingTime && remainingTime > endSwitchRoundPointTime - startRound) {
            return endSwitchRoundPointTime - startRound;
        }

        return remainingTime;
    }

    countdown() {
        if (this.totalRoundTime <= 1) {
            this.totalRoundTime = 0;
        } else {
            this.totalRoundTime--;
        }

        // console.log(`--------------------`)
        // console.log(`totalRoundTime: ${this.totalRoundTime}`)
        this.roundTime = this.getRemainingTime(this.totalRoundTime);
    }

    calculateRoundStatus() {
        this.roundState = this.getCurrentRoundState();
        // console.log({ roundState: this.roundState });


        if (this.roundTime < 0) {
            return;
        }

        if (this.isSwitchRoundInTurn) {

        }

        if (this.isWaiting) {
            this._remaining = this.roundTime - this.placingBet;
        }

        if (this.isShowAnimationResult) {
            this._remaining = this.generatingResult;
        }

        if (this.isShowResult) {
            let duration = 0;

            duration = this.roundTime - this.placingBet - this.startRound;

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

        if (this.isSwitchRoundInTurn) {
            return ROUND_STATE.SWITCH_ROUND;
        }

        return currentState;
    }

    start() {
        this.roundState = ROUND_STATE.START_GAME_LOOP;
    }

    resetRoundTimeStore() {
        this.roundState = ROUND_STATE.STOP_GAME_LOOP;
    }

    isInDisplayResultState() {
        return this.roundState === ROUND_STATE.SHOW_RESULT || this.roundState === ROUND_STATE.STARTING_ROUND;
    }
}
