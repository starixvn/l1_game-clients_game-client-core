import { inject, injectable } from "inversify";
import { when } from "mobx";
import { ConnectionStore } from "../../game/connection/connection-store";
import { HideGameHandler } from "../../game/hide-game";
import { RoundRunningHandlers } from "../../game/rounds";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { AutoCashOutStore } from "../auto-cash-out/auto-cash-out-store";
import { BetInputStore } from "../bet-input/bet-input-store";
import { IGameCrashUserSettings } from "../game-crash-messages";

@injectable()
export class HideGameCrashHandler extends HideGameHandler {
    constructor(
        @inject(RoundRunningHandlers) protected readonly roundRunning: RoundRunningHandlers,
        @inject(ConnectionStore) protected readonly connectStore: ConnectionStore,
        @inject(BetInputStore) protected readonly betInputStore: BetInputStore,
        @inject(AutoCashOutStore) protected readonly autoCashOutStore: AutoCashOutStore
    ) {
        super(roundRunning, connectStore);

        when(
            () => this.betInputStore.betAmount > 0,
            () => {
                this.saveUserSetting();
            }
        );
    }

    async handle() {
        await super.handle();
        this.betInputStore.betAmount > 0 && this.saveUserSetting();
    }

    saveUserSetting() {
        const currentSetting: IGameCrashUserSettings = {
            betAmount: this.betInputStore.betAmount,
            enableAutoCashOut: this.autoCashOutStore.enable,
            autoCashOutMultiplier: this.autoCashOutStore.multiplier,
        };

        StorageManager.set(localStorageKeys.userSetting, currentSetting);
    }
}
