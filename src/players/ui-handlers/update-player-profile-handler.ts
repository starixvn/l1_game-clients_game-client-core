import { inject, injectable } from "inversify";
import { PlayerStore } from "../player-store";

export interface IPlayerProfile {
  name?: string;

  ss?: string;
}

@injectable()
export class UpdatePlayerProfileHandler {
  constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

  handle(profile: IPlayerProfile) {
    profile?.name && (this.store.name = profile.name);
    profile?.ss && (this.store.ss = profile.ss);
  }
}
