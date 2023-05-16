import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { SettlementStatusStore } from "./settlement-status-store";
import { SettlementStore } from "./settlement-store";

@injectable()
export class SettlementHandlers implements IMultipleHandlers {
    constructor(
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore,
        @inject(SettlementStatusStore) protected readonly statusStore: SettlementStatusStore
    ) {}

    handleFinish(finish: GameServiceMessage.Finish | undefined) {
        this.settlementStore.setSettlementStore(finish);
    }

    handleStatus(status: GameServiceMessage.Status) {
        this.statusStore.setStatusStore(status);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Finish.eventName,
            handle: this.handleFinish,
        },
        {
            name: GameServiceMessage.Status.eventName,
            handle: this.handleStatus,
        },
    ];
}
