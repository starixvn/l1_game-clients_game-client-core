import { IModule } from "../commons";
import { SyncPlayerProfileHandler } from "./sync-player-profile-handler";
import { SyncStakeLevelHandler } from "./sync-stake-level-handler";

export * from "./player-store";
export * from "./sync-player-profile-handler";
export * from "./sync-stake-level-handler";

export default {
  listeners: [SyncPlayerProfileHandler, SyncStakeLevelHandler],
} as IModule;
