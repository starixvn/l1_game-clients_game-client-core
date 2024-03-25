import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { GameUserSettingHandler } from "../../../game/game-user-settings/game-user-setting-handler";
import { GameUserSettingAction, GameUserSettingStore } from "../../../game/game-user-settings/game-user-setting-store";
import { RoundPFHandler } from "../../../game/round-pf";
import { RoundTimeStore } from "../../../game/rounds/round-time-store";
import { GameServiceMessage } from "../../../shared";
import { IHandler } from "../../../shared/mediator";
import { StorageManager, localStorageKeys } from "../../../shared/utils";
import { PFClientSetting, VerificationMode } from "./definitions";
import { ProvablyFairStore } from "./provably-fair-store";

type PFUserSetting = {
    pf: PFClientSetting;
};

@injectable()
export class ProvablyFairHandler implements IHandler<GameServiceMessage.ProvablyFair> {
    constructor(
        @inject(ProvablyFairStore) protected readonly provablyFairStore: ProvablyFairStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameUserSettingStore) protected readonly gameUserSettingStore: GameUserSettingStore,
        @inject(GameUserSettingHandler) protected readonly gameUserSettingHandler: GameUserSettingHandler,
        @inject(RoundPFHandler) protected readonly roundPFHandler: RoundPFHandler
    ) {
        this.loadClientSettingFromStorage();

        reaction(
            () => this.roundTimeStore.isStartRound,
            (isStartRound) => {
                if (isStartRound) {
                    this.provablyFairStore.generateRandomClientSeed();
                    this.saveStorage();
                }
            }
        );

        reaction(
            () => this.gameUserSettingStore.permanentStorage,
            (trigger) => {
                if (trigger?.action === GameUserSettingAction.Save) {
                    this.onSaveStorage();
                }
            }
        );
    }
    name = GameServiceMessage.ProvablyFair.eventName;

    handle(pf: GameServiceMessage.ProvablyFair) {
        this.provablyFairStore.pf = pf;
    }

    loadClientSettingFromStorage() {
        const data = StorageManager.get(localStorageKeys.permanentGameUserSetting) as PFUserSetting;
        if (data && data?.pf) {
            const { manualClientSeed, randomClientSeedEnabled, randomClientSeed } = data.pf;
            this.provablyFairStore.manualClientSeed = manualClientSeed;
            this.provablyFairStore.randomClientSeed = randomClientSeed;
            this.provablyFairStore.randomClientSeedEnabled = randomClientSeedEnabled;
        } else {
            this.provablyFairStore.resetClientSetting();
        }
    }

    handleClientSeedPopup(openClientSeedPopup: boolean) {
        this.provablyFairStore.openClientSeedPopup = openClientSeedPopup ? {} : null;
    }

    clientSeedGenerationMode(randomClientSeedEnabled: boolean) {
        this.provablyFairStore.randomClientSeedEnabled = randomClientSeedEnabled;
        this.saveStorage();
    }

    private saveStorage() {
        this.gameUserSettingHandler.savePermanentStorage();
    }

    saveManualClientSeed(manualClientSeed: string) {
        this.provablyFairStore.manualClientSeed = manualClientSeed;
        this.saveStorage();
    }

    openVerificationLatestRound(roundId: number) {
        this.roundPFHandler.requestRoundPF(roundId);
        this.provablyFairStore.openVerification = { mode: VerificationMode.LatestRounds, roundId };
    }

    openVerificationHistory(roundId: number) {
        this.roundPFHandler.requestRoundPF(roundId);
        this.provablyFairStore.openVerification = { mode: VerificationMode.History, roundId };
    }

    closeVerification() {
        this.provablyFairStore.openVerification = null;
    }

    onSaveStorage() {
        const currentSetting = StorageManager.get(localStorageKeys.permanentGameUserSetting) as PFUserSetting;

        const pf = {
            randomClientSeedEnabled: this.provablyFairStore.randomClientSeedEnabled,
            randomClientSeed: this.provablyFairStore.randomClientSeed,
            manualClientSeed: this.provablyFairStore.manualClientSeed,
        };
        currentSetting.pf = pf;

        StorageManager.set(localStorageKeys.permanentGameUserSetting, currentSetting);
    }
}
