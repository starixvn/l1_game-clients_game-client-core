import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { IHandler } from "../../shared";
import { RoundHistoryStore } from "../round-histories";
import { SettlementStore } from "./settlement-store";

export namespace SettlementUIHandlers {
    @injectable()
    export class FinishedShowResult implements IHandler<void> {
        constructor(
            @inject(SettlementStore) private readonly settlementStore: SettlementStore,
            @inject(RoundHistoryStore) private readonly roundHistoryStore: RoundHistoryStore
        ) {
            reaction(
                () => this.settlementStore.isFinishedShowResult,
                (isFinishedShowResult) => isFinishedShowResult && this.updateRounds()
            );
        }

        handle() {
            this.settlementStore.isFinishedShowResult = true;
        }

        updateRounds() {
            this.roundHistoryStore.updateHistories(this.settlementStore.currentFinish);
        }
    }
}
