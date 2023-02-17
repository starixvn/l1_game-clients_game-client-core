import { Mediator } from "../commons";
import { SyncPlayerProfileHandler } from "./sync-player-profile-handler";
import { SyncStakeLevelHandler } from "./sync-stake-level-handler";

export class PlayerModule {
  constructor(
    mediator: Mediator,
    syncPlayerProfile: SyncPlayerProfileHandler,
    syncStakeLevel: SyncStakeLevelHandler
  ) {
    mediator.registerListener(syncPlayerProfile);
    mediator.registerListener(syncStakeLevel);
  }
}
