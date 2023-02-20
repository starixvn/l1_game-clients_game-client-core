import { inject, injectable } from "inversify";
import { Mediator } from "../common";
import { SyncPlayerProfileHandler } from "./sync-player-profile-handler";
import { SyncStakeLevelHandler } from "./sync-stake-level-handler";

@injectable()
export class PlayerModule {
  constructor(
    @inject(Mediator) mediator: Mediator,
    @inject(SyncPlayerProfileHandler)
    syncPlayerProfile: SyncPlayerProfileHandler,
    @inject(SyncStakeLevelHandler) syncStakeLevel: SyncStakeLevelHandler
  ) {
    mediator.registerHandlers([syncPlayerProfile, syncStakeLevel]);
  }
}
