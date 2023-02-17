import { inject, injectable } from "inversify";
import { IStakeLevel, PlayerStore } from "./player-store";

@injectable()
export class SyncStakeLevelHandler {
  constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

  handle(stakeLevel: IStakeLevel) {
    stakeLevel && (this.store.stakeLevel = stakeLevel);
  }

  properties = ["userStakeLevel"];
}
