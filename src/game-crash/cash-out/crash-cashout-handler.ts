import { inject, injectable } from "inversify";
import { BetStore } from "../../game/bets/bet-store";
import { MultiplierStore } from "../multiplier";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandler {
    constructor(
        @inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore,
        @inject(MultiplierStore) protected readonly multiplierStore: MultiplierStore,
        @inject(BetStore) protected readonly betStore: BetStore
    ) {}
    handle() {
        this.cashoutStore.cashoutAmount = this.betStore.amount * this.multiplierStore.multiplier;
    }
}
