import { inject, injectable } from "inversify";
import { IStakeLevel, PlayerStore } from "./player-store";
import { GameServiceMessage } from "../models/game-messages";
import { runInAction } from "mobx";
import { IMultipleHandlers } from "../common";

@injectable()
export class PlayerHandlers implements IMultipleHandlers {
  constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

  handleStakeLevel(stakeLevel: IStakeLevel) {
    runInAction(() => {
      stakeLevel && (this.store.stakeLevel = stakeLevel);
    });
  }

  handlePlayerProfile(profile: GameServiceMessage.User) {
    profile?.name && (this.store.name = profile.name);
    profile?.red && (this.store.balance = profile.red);
    profile?.avatarId && (this.store.avatarId = profile.avatarId);
  }

  eventHandleList = [
    {
      name: GameServiceMessage.toGame,
      handle: this.handleStakeLevel.bind(this),
    },
    {
      name: GameServiceMessage.User.eventName,
      handle: this.handlePlayerProfile.bind(this),
    },
  ];
}
