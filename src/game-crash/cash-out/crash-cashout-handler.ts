import { inject, injectable } from "inversify";
import { GameCrashEmitMessage, GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandler {
    constructor(@inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore) {}
    handle(betInfo: GameCrashEmitMessage.Bet, multiplierInfo: GameCrashServiceMessage.CrashMultiplierInfo) {
        this.cashoutStore.betAmount = betInfo.amount;
        this.cashoutStore.multiplier = multiplierInfo.m;
    }
}
