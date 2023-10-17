import { inject, injectable } from "inversify";
import { IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    constructor(@inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore) {}
    handleCashOutFull(cashOut: GameCrashServiceMessage.CrashCashoutFullInfo | undefined) {
        this.cashoutStore.cashoutAmount = cashOut.win;
    }
    handleCashOutHalf(halfCashOut: GameCrashServiceMessage.CrashCashoutHalfInfo | undefined) {
        this.cashoutStore.cashoutAmount = halfCashOut.win;
    }

    eventHandleList = [
        {
            name: GameCrashServiceMessage.CrashCashoutFullInfo.eventName,
            handle: this.handleCashOutFull,
        },
        {
            name: GameCrashServiceMessage.CrashCashoutHalfInfo.eventName,
            handle: this.handleCashOutHalf,
        },
    ];
}
