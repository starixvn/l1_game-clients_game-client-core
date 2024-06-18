import { inject, injectable } from "inversify";
import { IHandler } from "../../shared/mediator";
import { ConnectionStore } from "../connection/connection-store";
import { GameUserSettingHandler } from "../game-user-settings/game-user-setting-handler";
import { RoundRunningHandlers } from "../rounds/round-running-handlers";
import { HideGameGameStore } from "./hide-game-store";

@injectable()
export class HideGameHandler implements IHandler<void> {
    constructor(
        @inject(RoundRunningHandlers) protected readonly roundRunning: RoundRunningHandlers,
        @inject(ConnectionStore) protected readonly connectStore: ConnectionStore,
        @inject(GameUserSettingHandler) protected readonly gameUserSettingHandler: GameUserSettingHandler,
        @inject(HideGameGameStore) protected readonly hideGameGameStore: HideGameGameStore
    ) {}

    handle() {
        this.roundRunning.stopRunner();
        this.connectStore.onDisconnected();
        this.gameUserSettingHandler.saveTempStorage();
    }

    setIsHideGame(status: boolean) {
        this.hideGameGameStore.isHideGame = status;
    }
}
