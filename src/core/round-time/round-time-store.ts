import { injectable, inject } from "inversify";
import { MakeObservableFn, Store } from "../../common/store";

export type RoundTimeSetting = {
  wholeRound: number;
  placingBet: number;
  lockingBet: number;
  genResult: number;
};

@injectable()
export class RoundTimeStore implements Store {
  wholeRound: number = 0;
  placingBet: number = 0;
  lockingBet: number = 0;
  genResult: number = 0;
  roundTime: number = 0;

  isLockingBet: boolean;
  isPlacingBet: boolean;
  isWaiting: boolean;
  isChangeRemainingTime: boolean;
  isShowAnimation: boolean;
  isBeginShowAnimation: boolean;
  isBeginLockingBet: boolean;
  isBeginWaiting: boolean;
  isBeginPlacingBet: boolean;
  isTimeout: boolean;

  isStartingRound: boolean;
  isBeginStartingRound: boolean;

  isStartGameLoop: boolean;
  isStopGameLoop: boolean;

  duration: number;
  remaining: number;

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
    @inject("roundTimeSetting") roundTimeSetting: RoundTimeSetting
  ) {
    makeObservable(this);
    this.setRoundTimeSetting(roundTimeSetting);
  }

  get getIsWaiting() {
    return this.roundTime > this.placingBet && this.wholeRound !== 0;
  }

  get getIsLocking() {
    return this.roundTime <= this.lockingBet && this.wholeRound !== 0;
  }

  get getIsPlacingBet() {
    return (
      this.roundTime <= this.placingBet &&
      this.roundTime > this.lockingBet &&
      this.wholeRound !== 0
    );
  }

  get getIsBeforePlacingBet() {
    return this.roundTime > this.placingBet;
  }

  setRoundTimeSetting(setting: RoundTimeSetting) {
    this.wholeRound = setting.wholeRound;
    this.placingBet = setting.placingBet;
    this.lockingBet = setting.lockingBet;
    this.genResult = setting.genResult;
  }

  countdown() {
    if (this.roundTime <= 1) {
      this.roundTime = 0;
    } else {
      this.roundTime--;
    }

    this.calculateRoundStatus();
  }

  calculateRoundStatus() {
    if (this.roundTime < 0) {
      return;
    }

    if (this.overrideEvent && this.overrideEvent.remaining > 0) {
      this.overrideEvent.remaining--;
    }

    if (this.getIsWaiting) {
      this.isWaiting = true;
      this.remaining = this.roundTime - this.placingBet;
      this.duration = this.wholeRound - this.roundTime;
    }

    if (this.getIsLocking) {
      this.isLockingBet = true;
      this.duration = this.wholeRound - this.roundTime;
      this.remaining = this.roundTime;
    }

    if (this.isPlacingBet) {
      this.isPlacingBet = true;
      this.remaining = this.roundTime - this.lockingBet;
      this.duration = this.placingBet - this.roundTime;
    }
  }

  calculateRoundStatusOnStartupGame() {}

  start() {
    this.isStartGameLoop = true;
  }

  stop() {
    this.isStopGameLoop = true;
  }

  toJSON() {
    return {
      wholeRound: this.wholeRound,
      placingBet: this.placingBet,
      roundTime: this.roundTime,
      serviceStatus: {
        startNewRound: this.startNewRound,
        startPlacingBet: this.startPlacingBet,
        endPlacingBet: this.endPlacingBet,
        endRound: this.endRound,
      },
      clientStatus: {
        isWaiting: this.getIsWaiting,
        isBeforePlacingBet: this.getIsBeforePlacingBet,
        isPlacingBet: this.getIsPlacingBet,
        isLocking: this.getIsLocking,
      },
    };
  }
}
