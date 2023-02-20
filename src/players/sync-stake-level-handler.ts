import { inject, injectable } from "inversify";
import { IStakeLevel, PlayerStore } from "./player-store";
import { IGameServiceMessage } from "../models/contract-models";
import { nameof } from "ts-simple-nameof";
import { runInAction } from "mobx";

@injectable()
export class SyncStakeLevelHandler {
  constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

  handle(stakeLevel: IStakeLevel) {
    runInAction(() => {
      stakeLevel && (this.store.stakeLevel = stakeLevel);
    });
  }

  eventNames = [
    nameof<IGameServiceMessage>((receiveData) => receiveData.userStakeLevel),
  ];
}
