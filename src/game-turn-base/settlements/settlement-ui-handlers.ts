import { inject, injectable } from "inversify";
import { RoundHistoryStore } from "../round-histories";
import { SettlementStore } from "./settlement-store";
import { SettlementUIHandlers } from "../../game/settlements";

export namespace TurnBaseSettlementUIHandlers {
    @injectable()
    export class FinishedShowResult extends SettlementUIHandlers.FinishedShowResult {
        constructor(
            @inject(SettlementStore) protected readonly settlementStore: SettlementStore,
            @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore
        ) {
            super(settlementStore, roundHistoryStore);
        }

        override  handle() {
            this.handleFinishedShowResult();
            const { roundId, result, settlementResult, md5Result, drawId } = this.settlementStore;
            this.roundHistoryStore.insertNewRound({ roundId, result, settlementResult, md5Result, drawId });
        }
    }
}
