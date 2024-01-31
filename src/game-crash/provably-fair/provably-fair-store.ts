import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";
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
    crashPoint?: number;
    serverSeed?: string;
    clientSeeds?: CrashSingleClientSeed[];
    mergeSeed?: string;
    finalHash?: string;
}

@injectable()
export class ProvablyFairStore {
    randomClientSeedEnabled = true;
    manualClientSeed = "";
    randomClientSeed = this.randomClientSeedValue();

    get clientSeed() {
        return this.randomClientSeedEnabled ? this.randomClientSeed : this.manualClientSeed;
    }

    openClientSeedPopup = false;

    verification: CrashPFVerfication = null;

    constructor(
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(CrashCashOutStore) private readonly crashCashOutStore: CrashCashOutStore
    ) {
        makeAutoObservable(this);
    }

    generateRandomClientSeed() {
        this.randomClientSeed = this.randomClientSeedValue();
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
}
