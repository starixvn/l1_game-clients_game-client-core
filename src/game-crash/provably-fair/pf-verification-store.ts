import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { BetHistoryStore } from "../../game/bet-history/bet-history-store";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { CrashRoundHistoryStore } from "../round-history";
import { ProvablyFairStore, VerificationMode } from "./provably-fair-store";

@injectable()
export class PFVerificationStore {
    get verification(): GameServiceMessage.ProvablyFair | null {
        if (this.provablyFairStore.openVerification) {
            if (this.provablyFairStore.openVerification.mode === VerificationMode.LatestRounds) {
                return this.crashRoundHistoryStore.roundHistories.find(
                    (round) => round.roundId === this.provablyFairStore.openVerification.roundId
                )?.pf;
            } else {
                if (this.betHistoryStore.betHistoryModel) {
                    return this.betHistoryStore.betHistoryModel.betLogs.find(
                        (round) => round.roundId === this.provablyFairStore.openVerification.roundId
                    )?.["pf"];
                }
            }
        }

        return null;
    }

    constructor(
        @inject(ProvablyFairStore) private readonly provablyFairStore: ProvablyFairStore,
        @inject(BetHistoryStore) private readonly betHistoryStore: BetHistoryStore,
        @inject(CrashRoundHistoryStore) private readonly crashRoundHistoryStore: CrashRoundHistoryStore
    ) {
        makeAutoObservable(this);
    }
}
