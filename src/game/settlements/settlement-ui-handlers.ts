import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { RoundHistoryStore } from "../round-histories";
import { SettlementStore } from "./settlement-store";

export namespace SettlementUIHandlers {
    @injectable()
    export class FinishedShowResult implements IHandler<void> {
        constructor(
            @inject(SettlementStore) private readonly settlementStore: SettlementStore,
            @inject(RoundHistoryStore) private readonly roundHistoryStore: RoundHistoryStore
        ) {}
        handle() {
            this.settlementStore.isFinishedShowResult = true;
            const { roundId, result, settlementResult, md5Result, pf } = this.settlementStore;
            this.roundHistoryStore.updateHistories({ roundId, result, settlementResult, md5Result, pf });
        }
    }
}
