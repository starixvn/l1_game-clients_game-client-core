import { inject, injectable } from "inversify";

import { RoundStore } from "../../game/rounds/round-store";
import { IHandler } from "../../shared";
import { BetInputStore } from "./bet-input-store";

@injectable()
export class BetInputHandler implements IHandler<number> {
    constructor(
        @inject(BetInputStore) private readonly betInputStore: BetInputStore,
        @inject(RoundStore) private readonly roundStore: RoundStore
    ) {}

    handle() {
        this.betInputStore.betAmount = this.betInputStore.betAmountTemp;
        this.betInputStore.isOpenBetAmountPopup = false;
    }

    setBetAmountTemp(amount: number) {
        const calcAmount = this.betInputStore.betAmountTemp + amount;
        const validatedAmount = calcAmount > this.betInputStore.maxBet ? this.betInputStore.maxBet : calcAmount;

        this.betInputStore.betAmountTemp = validatedAmount;
    }

    resetBetAmount() {
        this.betInputStore.betAmountTemp = 0;
    }

    openBetAmountPopup() {
        this.betInputStore.betAmountTemp = 0;
        this.betInputStore.isOpenBetAmountPopup = true;
    }

    closeBetAmountPopup() {
        this.betInputStore.isOpenBetAmountPopup = false;
    }

    quickChangeBetAmount(isIncrease: boolean) {
        const amount = isIncrease
            ? this.betInputStore.betAmount + this.betInputStore.minBet
            : this.betInputStore.betAmount - this.betInputStore.minBet;

        if (amount < this.betInputStore.minBet || amount > this.betInputStore.maxBet) {
            return;
        }

        this.betInputStore.betAmount = amount;
    }
}
