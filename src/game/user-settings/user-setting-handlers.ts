import { inject, injectable } from "inversify";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { AudioType } from "../audios";
import { UserSettingData, UserSettingStore } from "./user-setting-store";
@injectable()
export class UserSettingHandlers {
    constructor(@inject(UserSettingStore) private readonly userSettingStore: UserSettingStore) {}

    loadStorages() {
        const settings = StorageManager.get(localStorageKeys.playerSetting);
        if (!settings) {
            return;
        }
        const keys = Object.keys(settings);
        keys?.forEach((key) => {
            try {
                this.userSettingStore[key] = settings[key];
            } catch (err) {
                console.log("User settings: storage key not map with settings store ", key);
            }
        });
    }

    saveStorages() {
        const data: UserSettingData = { musicEnable: this.userSettingStore.musicEnable, sfxEnable: this.userSettingStore.sfxEnable };
        StorageManager.set(localStorageKeys.playerSetting, data);
    }

    handleAudioChanged(type: AudioType, enable: boolean) {
        if (type === AudioType.MUSIC) {
            this.setMusicEnable(enable);
        } else if (type === AudioType.SFX) {
            this.setSfxEnable(enable);
        }
    }

    setMusicEnable(enable: boolean) {
        this.userSettingStore.musicEnable = enable;
        this.saveStorages();
    }

    setSfxEnable(enable: boolean) {
        this.userSettingStore.sfxEnable = enable;
        this.saveStorages();
    }
}
