import { inject, injectable } from "inversify";
import { when } from "mobx";
import { AppStore } from "../../app";
import { IHandler } from "../../shared";
import { AutoCashOutStore } from "../auto-cash-out/auto-cash-out-store";
import { BetInputStore } from "../bet-input/bet-input-store";
import { StorageManager, localStorageKeys } from "./../../shared/utils/storage-manager";

@injectable()
export class JoinGameCrashHandler implements IHandler<void> {
    constructor(
        @inject(BetInputStore) protected readonly betInputStore: BetInputStore,
        @inject(AutoCashOutStore) protected readonly autoCashOutStore: AutoCashOutStore,
        @inject(AppStore) protected readonly appStore: AppStore
    ) {
        when(
            () => this.appStore.isClearStorage,
            () => {
                this.handle();
            }
        );
    }

    handle() {
        StorageManager.remove(localStorageKeys.gameUserSetting);
        this.betInputStore.initBetAmount();
        this.autoCashOutStore.loadMultiplierFromStorage();
    }
}
