import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { GameServiceMessage } from "../../shared";
import { IHandler } from "../../shared/mediator";
import { RoundTimeStore } from "./../../game/rounds/round-time-store";
import { ProvablyFairStore, VerificationMode } from "./provably-fair-store";

@injectable()
export class ProvablyFairHandler implements IHandler<GameServiceMessage.ProvablyFair> {
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
    name = GameServiceMessage.ProvablyFair.eventName;

    handle(pf: GameServiceMessage.ProvablyFair) {
        this.provablyFairStore.pf = pf;
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

    openVerificationLatestRound(roundId: number) {
        this.provablyFairStore.openVerification = { mode: VerificationMode.LatestRounds, roundId };
    }

    openVerificationHistory(roundId: number) {
        this.provablyFairStore.openVerification = { mode: VerificationMode.History, roundId };
    }

    closeVerification() {
        this.provablyFairStore.openVerification = null;
    }

    handleIsClickPFIcon(isClickPFIcon: boolean) {
        this.provablyFairStore.isClickPFIcon = isClickPFIcon;
    }
}
