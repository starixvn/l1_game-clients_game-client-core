import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { SettlementAction, SettlementStatusStore } from "./settlement-status-store";
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

    handleWinners(winners: GameServiceMessage.Winners) {
        this.settlementStore.winningPlayers = winners.winningPlayers;
    }

    handleTotalWin(winAmount: number) {
        this.statusStore.eventData = { event: SettlementAction.TOTAL_WIN, winAmount: winAmount };
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
        {
            name: GameServiceMessage.Winners.eventName,
            handle: this.handleWinners,
        },
    ];
}
