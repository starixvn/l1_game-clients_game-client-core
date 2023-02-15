import { PlayerStore } from "./player-store";

interface PlayerProfile {
  name?: string;
  red?: number;
  avatarId?: number;
}

export class SyncPlayerProfileHandler {
  constructor(protected readonly store: PlayerStore) {}

  handle(profile: PlayerProfile) {
    profile?.name && (this.store.name = profile.name);
    profile?.red && (this.store.balance = profile.red);
    profile?.avatarId && (this.store.avatar = profile.avatarId);
  }

  properties = ["user"];
}
