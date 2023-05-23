import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface UserSettingData {
    musicEnable: boolean;
    sfxEnable: boolean;
}

@injectable()
export class UserSettingStore implements UserSettingData {
    constructor() {
        makeAutoObservable(this);
    }

    musicEnable = true;
    sfxEnable = true;
}
