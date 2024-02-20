import { inject, injectable } from "inversify";
import { GameUserSettingAction, GameUserSettingStore } from "./game-user-setting-store";

@injectable()
export class GameUserSettingHandler {
    constructor(@inject(GameUserSettingStore) private readonly userGameSettingStore: GameUserSettingStore) {}

    triggerSave() {
        this.userGameSettingStore.trigger = { action: GameUserSettingAction.Save };
    }
}
