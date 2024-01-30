import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { RoundTimeStore } from "./../../game/rounds/round-time-store";
import { CrashPFVerfication, ProvablyFairStore } from "./provably-fair-store";

@injectable()
export class ProvablyFairHandler {
    constructor(
        @inject(ProvablyFairStore) protected readonly provablyFairStore: ProvablyFairStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isStartRound,
            (isStartRound) => {
                if (isStartRound) {
                    this.provablyFairStore.generateRandomClientSeed();
                }
            }
        );
    }
    handleClientSeedPopup(openClientSeedPopup: boolean) {
        this.provablyFairStore.openClientSeedPopup = openClientSeedPopup;
    }

    clientSeedGenerationMode(randomClientSeedEnabled: boolean) {
        this.provablyFairStore.randomClientSeedEnabled = randomClientSeedEnabled;
    }

    saveManualClientSeed(manualClientSeed: string) {
        this.provablyFairStore.manualClientSeed = manualClientSeed;
    }

    changePFVerification(verification: CrashPFVerfication) {
        this.provablyFairStore.verification = verification;
    }
}
