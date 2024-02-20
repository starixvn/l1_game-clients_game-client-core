import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { AppStore } from "../../app/app-store";
import { StorageManager, localStorageKeys } from "./../../shared/utils/storage-manager";
import { GameUserSettingAction, GameUserSettingStore } from "./game-user-setting-store";
@injectable()
export class GameUserSettingHandler {
    constructor(
        @inject(GameUserSettingStore) private readonly userGameSettingStore: GameUserSettingStore,
        @inject(AppStore) protected readonly appStore: AppStore
    ) {
        reaction(
            () => this.appStore.isClearStorage,
            (isClearStorage) => {
                isClearStorage && this.clearStorage();
            }
        );
    }

    triggerLoad() {
        this.userGameSettingStore.trigger = { action: GameUserSettingAction.Load };
    }

    triggerSave() {
        this.userGameSettingStore.trigger = { action: GameUserSettingAction.Save };
    }

    clearStorage() {
        StorageManager.remove(localStorageKeys.gameUserSetting);
        this.triggerLoad();
    }
}
