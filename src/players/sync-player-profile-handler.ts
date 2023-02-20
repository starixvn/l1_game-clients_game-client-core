import { inject, injectable } from "inversify";
import { PlayerStore } from "./player-store";
import { IGameServiceMessage } from "../models/contract-models";
import { nameof } from "ts-simple-nameof";

interface PlayerProfile {
  name?: string;
  red?: number;
  avatarId?: number;
}

@injectable()
export class SyncPlayerProfileHandler {
  constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

  handle(profile: PlayerProfile) {
    profile?.name && (this.store.name = profile.name);
    profile?.red && (this.store.balance = profile.red);
    profile?.avatarId && (this.store.avatar = profile.avatarId);
  }

  eventNames = [nameof<IGameServiceMessage>((receiveData) => receiveData.user)];
}
