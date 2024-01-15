import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { UserSettingStore } from "../../game/user-settings/user-setting-store";
import { RocketState } from "../game-crash-messages";

@injectable()
export class MultiplierStore {
    multiplier = 0;
    time = 0;

    private _rocketState: string = RocketState.ONLAND;

    constructor(@inject(UserSettingStore) protected readonly userSettingsStore: UserSettingStore) {
        makeAutoObservable(this);
    }

    get rocketState(): string {
        return this._rocketState;
    }

    set rocketState(value: string) {
        this._rocketState = value;
    }

    get playSoundRocketFly() {
        return this.userSettingsStore.sfxEnable && this.rocketState === RocketState.FLYING;
    }
}
