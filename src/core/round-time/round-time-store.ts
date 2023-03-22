import { GameSetting } from "./../game-setting";
import { injectable, inject } from "inversify";
import { MakeObservableFn, Store } from "../../common/store";

export type RoundTimeSetting = {
  wholeRound: number;
  placingBet: number;
  lockingBet: number;
  genResult: number;
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
export class RoundTimeStore implements Store {
  wholeRound: number = 0;
  placingBet: number = 0;
  lockingBet: number = 0;
  genResult: number = 0;
  _roundTime: number = 0;
  _roundState: string = ROUND_STATE.STARTING_ROUND;
  _beginState: string = "";

  _isLockingBet: boolean;
  _isPlacingBet: boolean;
  _isWaiting: boolean;
  _isStartGameLoop: boolean;
  _isStopGameLoop: boolean;

  _duration: number;
  _remaining: number;

  startNewRound: boolean = false;
  endRound: boolean = false;
  startPlacingBet: boolean = false;
  endPlacingBet: boolean = false;

  overrideEvent: {
    name: string;
    remaining: number;
    duration: number;
  };

  constructor(
    @inject("makeObservable") makeObservable: MakeObservableFn,
    @inject(GameSetting) gameSetting: GameSetting
  ) {
    makeObservable(this);
    const durations = gameSetting.durations;
    this.setRoundTimeSetting({
      lockingBet: durations.lockingBet,
      wholeRound: durations.wholeRound,
      placingBet: durations.placingBet,
      genResult: durations.generatingResult,
    });
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
    return (
      this._roundTime <= this.placingBet &&
      this._roundTime > this.lockingBet &&
      this.wholeRound !== 0
    );
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
    this.genResult = setting.genResult;
  }

  countdown() {
    if (this._roundTime <= 1) {
      this._roundTime = 0;
    } else {
      this._roundTime--;
    }

    this.calculateRoundStatus();
  }

  set roundTime(roundTime: number) {
    this._roundTime = roundTime;
    this.calculateRoundStatus();
  }

  calculateRoundStatus() {
    if (this._roundTime < 0) {
      this._roundState = ROUND_STATE.WAITING;
      return;
    }

    if (this.isStartPlacingBet) {
      this._beginState = ROUND_STATE.BEGIN_PLACING_BET;
    }

    if (this.isStaringLocking) {
      this._beginState = ROUND_STATE.BEGIN_LOCKING_BET;
    }

    if (this.isStartWaiting) {
      this._beginState = ROUND_STATE.BEGIN_WAITING;
    }

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
