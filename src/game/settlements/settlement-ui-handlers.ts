import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { SettlementStore } from "./settlement-store";

export namespace SettlementUIHandlers {
    @injectable()
    export class FinishedShowResult implements IHandler<void> {
        constructor(@inject(SettlementStore) private readonly settlementStore: SettlementStore) {}
        handle() {
            this.settlementStore.isFinishedShowResult = true;
        }
    }
}
