import { inject, injectable } from "inversify";
import { StorageManager } from "../../shared/utils";
import { AudioType } from "../audios";
import { UserSettingData, UserSettingStore } from "./user-setting-store";
@injectable()
export class UserSettingHandlers {
    constructor(@inject(UserSettingStore) private readonly userSettingStore: UserSettingStore) {}

    private readonly userSettingsKey = "user-setting";
    loadStorages() {
        const settings = StorageManager.get(this.userSettingsKey);
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
        const data = this.userSettingStore as UserSettingData;
        StorageManager.set(this.userSettingsKey, data);
    }

    handleAudioChanged(type: AudioType, enable: boolean) {
        if (type === AudioType.Music) {
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
