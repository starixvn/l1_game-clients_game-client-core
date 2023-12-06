import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { RoundTimeStore } from "../../game/rounds";
import { IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashOutStore } from "./crash-cash-out-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    constructor(
        @inject(CrashCashOutStore) protected readonly cashOutStore: CrashCashOutStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (isPlacingBet) {
                    this.cashOutStore.isCashedOutHalf = false;
                    this.cashOutStore.isCashedOutFull = false;
                    this.cashOutStore.ratio = 1;
                }
            }
        );
    }
    handleCashOutFull(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.cashOutStore.cashOut = cashOut;
        this.cashOutStore.isCashedOutFull = true;
        this.cashOutStore.isCashedOutHalf = true;
        this.cashOutStore.cashOutNotice = {
            win: cashOut.win,
            cashOutWin: cashOut.cashOutWin,
            reachMaxWin: cashOut.reachMaxWin,
        };
        setTimeout(() => {
            this.cashOutStore.ratio = 1;
        }, 2700);
    }

    handleCashOutHalf(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.cashOutStore.ratio = 0.5;
        this.cashOutStore.halfCashOut = cashOut;
        this.cashOutStore.cashOutNotice = {
            win: cashOut.win,
            cashOutWin: cashOut.cashOutWin,
            reachMaxWin: cashOut.reachMaxWin,
        };
        this.cashOutStore.isCashedOutHalf = true;
        this.cashOutStore.cashOutBet = { value: this.cashOutStore.cashOutBet.value / 2 };
    }

    eventHandleList = [
        {
            name: GameCrashServiceMessage.CrashCashOut.cashOutEventName,
            handle: this.handleCashOutFull,
        },
        {
            name: GameCrashServiceMessage.CrashCashOut.halfCashOutEventName,
            handle: this.handleCashOutHalf,
        },
    ];
}
