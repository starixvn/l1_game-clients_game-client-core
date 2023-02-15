import { IStakeLevel, PlayerStore } from "./player-store";

export class SyncStakeLevelHandler {
  constructor(protected readonly store: PlayerStore) {}

  handle(stakeLevel: IStakeLevel) {
    stakeLevel && (this.store.stakeLevel = stakeLevel);
  }

  properties = ["userStakeLevel"];
}
