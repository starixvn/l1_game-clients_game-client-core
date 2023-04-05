import { IMultipleHandlers } from "../../common/mediator";
import { RoundTimeStore } from "./round-time-store";
import { inject, injectable } from "inversify";
import { GameServiceMessage } from "../../models/game-messages";

@injectable()
export class RoundTimeHandlers implements IMultipleHandlers {
  constructor(
    @inject(RoundTimeStore) protected readonly store: RoundTimeStore
  ) {}

  handleRemainingTime(remainingTime: number) {
    if (remainingTime > 0) {
      this.store.roundTime = remainingTime;
    }
  }

  handleStartNewRoundStatus(snr: boolean) {
    this.store.startNewRound = snr;
  }

  handleStartPlacingBetStatus(spb: boolean) {
    this.store.startPlacingBet = spb;
  }

  handleEndPlacingBetStatus(epb: boolean) {
    this.store.endPlacingBet = epb;
  }

  handleEndRoundStatus(finish: GameServiceMessage.Finish) {
    if (finish) {
      this.store.endRound = true;
      this.store.endPlacingBet = false;
      this.store.startPlacingBet = false;
    }
  }

  eventHandleList = [
    {
      name: GameServiceMessage.remainingTime,
      handle: this.handleRemainingTime.bind(this),
    },
    {
      name: GameServiceMessage.snr,
      handle: this.handleStartNewRoundStatus.bind(this),
    },
    {
      name: GameServiceMessage.spb,
      handle: this.handleStartPlacingBetStatus.bind(this),
    },
    {
      name: GameServiceMessage.epb,
      handle: this.handleEndPlacingBetStatus.bind(this),
    },
    {
      name: GameServiceMessage.Finish.eventName,
      handle: this.handleEndRoundStatus.bind(this),
    },
  ];
}
