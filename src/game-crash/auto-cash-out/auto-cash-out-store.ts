import { inject, injectable } from "inversify";
import { makeAutoObservable, when } from "mobx";

import { RoundStore } from "../../game/rounds/round-store";
import { localStorageKeys, StorageManager } from "../../shared/utils/storage-manager";
import { GameCrashServiceMessage, IGameCrashUserSettings } from "../game-crash-messages";

@injectable()
export class AutoCashOutStore {
    constructor(@inject(RoundStore) protected readonly roundStore: RoundStore) {
        makeAutoObservable(this);
        this.loadMultiplierFromStorage();

        when(
            () => this.roundStore && this.roundStore.ownBets && Object.keys(this.roundStore.ownBets).length > 0,
            () => {
                this.setMultiplierFromOwnBets(this.roundStore.ownBets as GameCrashServiceMessage.CrashOwnBets);
            }
        );
    }

    private _enable = false;
    private _multiplier = 1.01;

    private _disable = false;

    private loadMultiplierFromStorage() {
        const userSetting = StorageManager.get(localStorageKeys.userSetting) as IGameCrashUserSettings;
        if (userSetting) {
            userSetting.autoCashOutMultiplier && (this.multiplier = userSetting.autoCashOutMultiplier);
            userSetting.enableAutoCashOut && (this.enable = userSetting.enableAutoCashOut);
        }
    }

    private setMultiplierFromOwnBets(ownBets: GameCrashServiceMessage.CrashOwnBets) {
        if (ownBets && !ownBets.cashOut && ownBets.autoCashOut >= 0) {
            this.enable = false;
            const autoCashOut = +ownBets.autoCashOut;
            if (autoCashOut > 0) {
                this.multiplier = autoCashOut;
                this.enable = true;
            }
        }
    }

    get enable(): boolean {
        return this._enable;
    }

    set enable(trigger: boolean) {
        this._enable = trigger;
    }

    get multiplier(): number {
        return this._multiplier;
    }

    set multiplier(multiplier: number) {
        this._multiplier = multiplier;
    }

    get disable(): boolean {
        return this._disable;
    }

    set disable(trigger: boolean) {
        this._disable = trigger;
    }

    resetDefaultValueStore() {
        this._enable = false;
        this._multiplier = 1.01;
    }
}
