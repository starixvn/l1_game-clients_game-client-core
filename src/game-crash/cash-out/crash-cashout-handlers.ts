import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandlers implements IHandler<GameCrashServiceMessage.CrashCashoutInfo> {
    name = GameCrashServiceMessage.CrashMultiplierInfo.eventName;
    constructor(@inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore) {}
    handle(cashOut: GameCrashServiceMessage.CrashCashoutInfo | undefined) {
        this.cashoutStore.cashoutAmount = cashOut.win;
    }
}
