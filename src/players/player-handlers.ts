import { inject, injectable } from "inversify";
import { IStakeLevel, PlayerStore } from "./player-store";
import { IGameServiceMessage } from "../models/contract-models";
import { nameof } from "ts-simple-nameof";
import { runInAction } from "mobx";
import { IMultipleHandlers } from "../common";

interface PlayerProfile {
  name?: string;
  red?: number;
  avatarId?: number;
}

@injectable()
export class PlayerHandlers implements IMultipleHandlers {
  constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

  handleStakeLevel(stakeLevel: IStakeLevel) {
    runInAction(() => {
      stakeLevel && (this.store.stakeLevel = stakeLevel);
    });
  }

  handlePlayerProfile(profile: PlayerProfile) {
    profile?.name && (this.store.name = profile.name);
    profile?.red && (this.store.balance = profile.red);
    profile?.avatarId && (this.store.avatar = profile.avatarId);
  }

  eventHandleList = [
    {
      name: nameof<IGameServiceMessage>(
        (receiveData) => receiveData.userStakeLevel
      ),
      handle: this.handleStakeLevel.bind(this),
    },
    {
      name: nameof<IGameServiceMessage>((receiveData) => receiveData.user),
      handle: this.handlePlayerProfile.bind(this),
    },
  ];
}
