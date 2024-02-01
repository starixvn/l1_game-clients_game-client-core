import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { CrashRoundHistoryStore } from "../round-history";
import { ProvablyFairStore } from "./provably-fair-store";

@injectable()
export class PFVerificationStore {
    get verification(): GameServiceMessage.ProvablyFair | undefined {
        return this.crashRoundHistoryStore.roundHistories.find((round) => round.roundId === this.provablyFairStore.selectedRoundId.value)
            ?.pf;
    }

    constructor(
        @inject(ProvablyFairStore) private readonly provablyFairStore: ProvablyFairStore,
        @inject(CrashRoundHistoryStore) private readonly crashRoundHistoryStore: CrashRoundHistoryStore
    ) {
        makeAutoObservable(this);
    }
}
