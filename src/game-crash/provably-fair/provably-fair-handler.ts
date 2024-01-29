import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { reaction } from "mobx";
import { RoundTimeStore } from "./../../game/rounds/round-time-store";
import { ProvablyFairStore } from "./provably-fair-store";

@injectable()
export class ProvablyFairHandler {
    constructor(
        @inject(ProvablyFairStore) protected readonly provablyFairStore: ProvablyFairStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => {
                return this.roundTimeStore.isStartRound;
            },
            (isStartRound) => {
                this.provablyFairStore.randomClientSeed = this.generateClientSeedRandom();
            }
        );
    }
    handleClientSeedPopup(openClientSeedPopup: boolean) {
        this.provablyFairStore.openClientSeedPopup = openClientSeedPopup;
    }

    generateClientSeedRandom(): string {
        return _.random(1000, 9999).toString();
    }

    clientSeedGenerationMode(randomClientSeedEnabled: boolean) {
        this.provablyFairStore.randomClientSeedEnabled = randomClientSeedEnabled;
    }

    saveManualClientSeed(manualClientSeed: string) {
        this.provablyFairStore.manualClientSeed = manualClientSeed;
    }
}
