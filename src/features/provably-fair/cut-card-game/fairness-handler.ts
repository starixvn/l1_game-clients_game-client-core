import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { reaction } from "mobx";
import { RoundPFHandler } from "../../../game-baccaratx/round-pf/round-pf-handler";
import { ConnectionHandlers } from "../../../game/connection/connection-handlers";
import { ConnectionStore } from "../../../game/connection/connection-store";
import { GameUserSettingHandler } from "../../../game/game-user-settings/game-user-setting-handler";
import { GameUserSettingAction, GameUserSettingStore } from "../../../game/game-user-settings/game-user-setting-store";
import { GameClientEmitMessage } from "../../../shared/models/game-messages";
import { StorageManager, localStorageKeys } from "../../../shared/utils";
import { FairnessStore } from "./fairness-store";

type FairnessUserSetting = {
    clientSeed: string;
};

@injectable()
export class FairnessHandler {
    constructor(
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,

        @inject(GameUserSettingStore) protected readonly gameUserSettingStore: GameUserSettingStore,
        @inject(GameUserSettingHandler) protected readonly gameUserSettingHandler: GameUserSettingHandler,
        @inject(RoundPFHandler) protected readonly roundPFHandler: RoundPFHandler,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler
    ) {
        this.loadClientSettingFromStorage();
        reaction(
            () => this.gameUserSettingStore.permanentStorage,
            (trigger) => {
                if (trigger?.action === GameUserSettingAction.Save) {
                    this.onSaveStorage();
                }
            }
        );
    }

    loadClientSettingFromStorage() {
        const data = StorageManager.get(localStorageKeys.permanentGameUserSetting) as FairnessUserSetting;
        if (data && data?.clientSeed) {
            this.fairnessStore.clientSeed = data.clientSeed;
        } else {
            this.generateClientSeed();
        }
    }

    handle(clientSeed: string) {
        this.fairnessStore.clientSeed = clientSeed;
        this.connectionStore.send(GameClientEmitMessage.CutCard.eventName, { cutCardIndex: this.fairnessStore.clientSeed });
    }

    saveClientSeed(clientSeed: string) {
        this.fairnessStore.clientSeed = clientSeed;
        this.saveStorage();
    }

    private saveStorage() {
        this.gameUserSettingHandler.savePermanentStorage();
    }

    setMinClientSeed(min: number) {
        this.fairnessStore.minClientSeed = min;
    }

    setMaxClientSeed(max: number) {
        this.fairnessStore.maxClientSeed = max;
    }

    generateClientSeed() {
        if (this.fairnessStore.minClientSeed === 0 || this.fairnessStore.maxClientSeed === 0) {
            return;
        }
        this.fairnessStore.clientSeed = this.randomClientSeedValue();
    }

    private randomClientSeedValue(): string {
        return _.random(this.fairnessStore.minClientSeed, this.fairnessStore.maxClientSeed).toString();
    }

    onSaveStorage() {
        const currentSetting = (StorageManager.get(localStorageKeys.permanentGameUserSetting) || {}) as FairnessUserSetting;
        currentSetting.clientSeed = this.fairnessStore.clientSeed;

        StorageManager.set(localStorageKeys.permanentGameUserSetting, currentSetting);
    }

    handleShowFairnessSettingsPopup(isShow: boolean) {
        this.fairnessStore.isShowFairnessSettingsPopup = isShow;
        if (!isShow) {
            this.fairnessStore.showWaitingScreen = true;
        }
    }

    updateDontShowAgain(isShow: boolean) {
        this.fairnessStore.dontShowAgain = isShow;
    }

    openVerificationHistory(roundId: number) {
        this.roundPFHandler.requestRoundPF(roundId);
        this.fairnessStore.openVerification = { isOpen: true, roundId };
    }

    closeVerification() {
        this.fairnessStore.openVerification = { isOpen: false };
    }

    openCutCardIndex(roundId: number) {
        this.fairnessStore.openCutCardIndex = { isOpen: true, roundId };
    }

    closeCutCardIndex() {
        this.fairnessStore.openCutCardIndex = { isOpen: false };
    }
}
