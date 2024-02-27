import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { ConnectionStore } from "../../game/connection/connection-store";
import { GameUserSettingAction, GameUserSettingStore } from "../../game/game-user-settings/game-user-setting-store";
import { RoundRunningHandlers } from "../../game/rounds";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { AutoCashOutStore } from "../auto-cash-out/auto-cash-out-store";
import { BetInputStore } from "../bet-input/bet-input-store";
import { IGameCrashPermanentUserSettings, IGameCrashUserSettings } from "../game-crash-messages";
import { ProvablyFairHandler, ProvablyFairStore } from "../provably-fair";

@injectable()
export class GameCrashUserSettingHandler {
    constructor(
        @inject(RoundRunningHandlers) protected readonly roundRunning: RoundRunningHandlers,
        @inject(ConnectionStore) protected readonly connectStore: ConnectionStore,
        @inject(BetInputStore) protected readonly betInputStore: BetInputStore,
        @inject(AutoCashOutStore) protected readonly autoCashOutStore: AutoCashOutStore,
        @inject(ProvablyFairStore) protected readonly provablyFairStore: ProvablyFairStore,
        @inject(ProvablyFairHandler) protected readonly provablyFairHandler: ProvablyFairHandler,
        @inject(GameUserSettingStore) protected readonly gameUserSettingStore: GameUserSettingStore
    ) {
        reaction(
            () => this.gameUserSettingStore.tempStorage,
            (trigger) => {
                if (trigger?.action === GameUserSettingAction.Save) {
                    this.saveTempStorage();
                } else if (trigger?.action === GameUserSettingAction.Load) {
                    this.reloadOtherStores();
                }
            }
        );

        reaction(
            () => this.gameUserSettingStore.permanentStorage,
            (trigger) => {
                if (trigger?.action === GameUserSettingAction.Save) {
                    this.savePermanentStorage();
                }
            }
        );
    }

    reloadOtherStores() {
        this.betInputStore.initBetAmount();
        this.autoCashOutStore.loadMultiplierFromStorage();
        this.provablyFairHandler.loadClientSettingFromStorage();
    }

    saveTempStorage() {
        const currentSetting: IGameCrashUserSettings = {
            enableAutoCashOut: this.autoCashOutStore.enable,
            autoCashOutMultiplier: this.autoCashOutStore.multiplier,
        };

        if (this.betInputStore.betAmount > 0) {
            currentSetting.betAmount = this.betInputStore.betAmount;
        }

        StorageManager.set(localStorageKeys.gameUserSetting, currentSetting);
    }

    savePermanentStorage() {
        const currentSetting: IGameCrashPermanentUserSettings = {
            pf: {
                randomClientSeedEnabled: this.provablyFairStore.randomClientSeedEnabled,
                randomClientSeed: this.provablyFairStore.randomClientSeed,
                manualClientSeed: this.provablyFairStore.manualClientSeed,
            },
        };

        StorageManager.set(localStorageKeys.permanentGameUserSetting, currentSetting);
    }
}
