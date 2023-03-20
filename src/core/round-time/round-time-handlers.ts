import { IMultipleHandlers } from "../../common/mediator";
import { RoundTimeStore } from "./round-time-store";
import { inject, injectable } from "inversify";
import { IGameServiceMessage } from "../../models/contract-models";
import { nameof } from "ts-simple-nameof";

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

  handleEndRoundStatus(finish: boolean) {
    if (finish) {
      this.store.endRound = true;
      this.store.endPlacingBet = false;
      this.store.startPlacingBet = false;
    }
  }

  eventHandleList = [
    {
      name: nameof<IGameServiceMessage>(
        (receiveData) => receiveData.remainingTime
      ),
      handle: this.handleRemainingTime.bind(this),
    },
    {
      name: nameof<IGameServiceMessage>((receiveData) => receiveData.snr),
      handle: this.handleStartNewRoundStatus.bind(this),
    },
    {
      name: nameof<IGameServiceMessage>((receiveData) => receiveData.spb),
      handle: this.handleStartPlacingBetStatus.bind(this),
    },
    {
      name: nameof<IGameServiceMessage>((receiveData) => receiveData.epb),
      handle: this.handleEndPlacingBetStatus.bind(this),
    },
    {
      name: nameof<IGameServiceMessage>((receiveData) => receiveData.finish),
      handle: this.handleEndRoundStatus.bind(this),
    },
  ];
}
