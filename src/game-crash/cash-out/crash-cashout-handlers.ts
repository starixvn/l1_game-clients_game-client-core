import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { RoundTimeStore } from "../../game/rounds";
import { IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    constructor(
        @inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (isPlacingBet) {
                    this.cashoutStore.isCashedOutHalf = false;
                    this.cashoutStore.isCashedOutFull = false;
                    this.cashoutStore.ratio = 1;
                }
            }
        );
    }
    handleCashoutFull(cashOut: GameCrashServiceMessage.CrashCashout | undefined) {
        this.cashoutStore.cashOut = cashOut;
        this.cashoutStore.isCashedOutFull = true;
        this.cashoutStore.isCashedOutHalf = true;
        this.cashoutStore.halfCashOut = { win: cashOut.win / 2, multiplier: cashOut.multiplier, amount: cashOut.amount };
        this.cashoutStore.cashOutNotice = {
            value: cashOut.win,
        };
        setTimeout(() => {
            this.cashoutStore.ratio = 1;
        }, 2700);
    }

    handleCashoutHalf(cashOut: GameCrashServiceMessage.CrashCashout | undefined) {
        this.cashoutStore.ratio = 0.5;
        this.cashoutStore.halfCashOut = cashOut;
        this.cashoutStore.cashOutNotice = {
            value: cashOut.win,
        };
        this.cashoutStore.isCashedOutHalf = true;
        this.cashoutStore.cashoutBet = { value: this.cashoutStore.cashoutBet.value / 2 };
    }

    eventHandleList = [
        {
            name: GameCrashServiceMessage.CrashCashout.cashOutEventName,
            handle: this.handleCashoutFull,
        },
        {
            name: GameCrashServiceMessage.CrashCashout.halfCashOutEventName,
            handle: this.handleCashoutHalf,
        },
    ];
}
