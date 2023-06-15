import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { SettlementStatusStore } from "./settlement-status-store";
import { SettlementStore } from "./settlement-store";

export namespace SettlementUIHandlers {
    @injectable()
    export class FinishedShowResult implements IHandler<void> {
        constructor(@inject(SettlementStore) private readonly settlementStore: SettlementStore) {}
        handle() {
            this.settlementStore.isFinishedShowResult = true;
        }
    }

    @injectable()
    export class FinishedSettlement implements IHandler<void> {
        constructor(
            @inject(SettlementStore) private readonly settlementStore: SettlementStore,
            @inject(SettlementStatusStore) private readonly settlementStatusStore: SettlementStatusStore
        ) {}
        handle() {
            this.settlementStatusStore.resetSettlementStatus();
        }
    }
}
