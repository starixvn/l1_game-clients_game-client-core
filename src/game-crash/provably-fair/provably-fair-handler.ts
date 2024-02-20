import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { GameUserSettingHandler } from "../../game/game-user-settings/game-user-setting-handler";
import { GameUserSettingAction, GameUserSettingStore } from "../../game/game-user-settings/game-user-setting-store";
import { GameServiceMessage } from "../../shared";
import { IHandler } from "../../shared/mediator";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { IGameCrashUserSettings } from "../game-crash-messages";
import { RoundTimeStore } from "./../../game/rounds/round-time-store";
import { ProvablyFairStore, VerificationMode } from "./provably-fair-store";

@injectable()
export class ProvablyFairHandler implements IHandler<GameServiceMessage.ProvablyFair> {
    constructor(
        @inject(ProvablyFairStore) protected readonly provablyFairStore: ProvablyFairStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameUserSettingStore) protected readonly gameUserSettingStore: GameUserSettingStore,
        @inject(GameUserSettingHandler) protected readonly gameUserSettingHandler: GameUserSettingHandler
    ) {
        reaction(
            () => this.roundTimeStore.isStartRound,
            (isStartRound) => {
                if (isStartRound) {
                    this.provablyFairStore.generateRandomClientSeed();
                    this.gameUserSettingHandler.triggerSave();
                }
            }
        );
        this.loadClientSettingFromStorage();
        reaction(
            () => this.gameUserSettingStore.trigger,
            (trigger) => {
                if (trigger?.action === GameUserSettingAction.Load) {
                    this.loadClientSettingFromStorage();
                }
            }
        );
    }
    name = GameServiceMessage.ProvablyFair.eventName;

    handle(pf: GameServiceMessage.ProvablyFair) {
        this.provablyFairStore.pf = pf;
    }

    loadClientSettingFromStorage() {
        const data = StorageManager.get(localStorageKeys.gameUserSetting) as IGameCrashUserSettings;
        if (data && data?.pfClientSetting) {
            const { manualClientSeed, randomClientSeedEnabled, randomClientSeed } = data.pfClientSetting;
            this.provablyFairStore.manualClientSeed = manualClientSeed;
            this.provablyFairStore.randomClientSeed = randomClientSeed;
            this.provablyFairStore.randomClientSeedEnabled = randomClientSeedEnabled;
        } else {
            this.provablyFairStore.resetClientSetting();
        }
    }

    handleClientSeedPopup(openClientSeedPopup: boolean) {
        this.provablyFairStore.openClientSeedPopup = openClientSeedPopup;
    }

    clientSeedGenerationMode(randomClientSeedEnabled: boolean) {
        this.provablyFairStore.randomClientSeedEnabled = randomClientSeedEnabled;
        this.gameUserSettingHandler.triggerSave();
    }

    saveManualClientSeed(manualClientSeed: string) {
        this.provablyFairStore.manualClientSeed = manualClientSeed;
        this.gameUserSettingHandler.triggerSave();
    }

    openVerificationLatestRound(roundId: number) {
        this.provablyFairStore.openVerification = { mode: VerificationMode.LatestRounds, roundId };
    }

    openVerificationHistory(roundId: number) {
        this.provablyFairStore.openVerification = { mode: VerificationMode.History, roundId };
    }

    closeVerification() {
        this.provablyFairStore.openVerification = null;
    }
}
