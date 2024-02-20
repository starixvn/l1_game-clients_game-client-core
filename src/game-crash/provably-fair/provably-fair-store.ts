import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { ButtonState } from "../game-crash-messages";
import { PlayerActionStore } from "../player-actions/player-action-store";

export interface CrashSingleClientSeed {
    nickname: string;
    clientSeed: string;
}

export interface CrashPFVerfication {
    roundId: number;
    serverSeedHash: string;
    result?: number;
    serverSeed?: string;
    clientSeeds?: CrashSingleClientSeed[];
    mergeSeed?: string;
    finalHash?: string;
}

export enum VerificationMode {
    History = 0,
    LatestRounds = 1,
}

export interface OpenVerification {
    mode: VerificationMode;
    roundId?: number;
}

@injectable()
export class ProvablyFairStore {
    randomClientSeedEnabled = true;
    randomClientSeed = this.randomClientSeedValue();
    manualClientSeed = "";
    get clientSeed() {
        return this.randomClientSeedEnabled ? this.randomClientSeed : this.manualClientSeed;
    }

    openClientSeedPopup = false;

    openVerification: OpenVerification = null;

    pf: GameServiceMessage.ProvablyFair = null;

    constructor(
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(CrashCashOutStore) private readonly crashCashOutStore: CrashCashOutStore
    ) {
        makeAutoObservable(this);
    }

    generateRandomClientSeed() {
        this.randomClientSeed = this.randomClientSeedValue();
    }

    resetClientSetting() {
        this.randomClientSeedEnabled = true;
        this.randomClientSeed = this.randomClientSeedValue();
        this.manualClientSeed = "";
    }

    private randomClientSeedValue(): string {
        return _.random(1000, 9999).toString();
    }

    get notAllowChangeClientSeed() {
        return (
            this.playerActionStore.buttonState === ButtonState.BET_ACCEPTED ||
            (this.playerActionStore.buttonState === ButtonState.CASH_OUT && !this.crashCashOutStore.isFullCashedOut)
        );
    }

    get showManualClientSeedPopup() {
        return !this.randomClientSeedEnabled && this.manualClientSeed === "";
    }

    get clientSeedForManualForm() {
        return this.manualClientSeed !== "" ? this.manualClientSeed : this.randomClientSeed;
    }

    get allowChangeManualClientSeed() {
        return !this.notAllowChangeClientSeed && !this.randomClientSeedEnabled;
    }

    get selectedRandomMode() {
        return !this.notAllowChangeClientSeed && this.randomClientSeedEnabled;
    }
}
