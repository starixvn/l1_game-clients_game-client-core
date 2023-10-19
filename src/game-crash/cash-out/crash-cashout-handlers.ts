import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { BetStore } from "../../game/bets";
import { RoundTimeStore } from "../../game/rounds";
import { IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    constructor(
        @inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) protected readonly betStore: BetStore
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
    handleCashoutFull(cashOut: GameCrashServiceMessage.CrashCashoutFull | undefined) {
        this.cashoutStore.cashoutAmount = cashOut.win;
        this.cashoutStore.isCashedOutFull = true;
        this.cashoutStore.isCashedOutHalf = true;
        this.cashoutStore.cashOutNotice = {
            value: cashOut.win,
        };
        console.log("handleCashoutFull", this.cashoutStore.cashOutNotice.value);
    }

    handleCashoutHalf(cashOut: GameCrashServiceMessage.CrashCashoutHalf | undefined) {
        this.cashoutStore.ratio = 0.5;
        this.cashoutStore.cashoutHalfAmount = cashOut.win;
        this.cashoutStore.cashOutNotice = {
            value: cashOut.win,
        };
        this.cashoutStore.isCashedOutHalf = true;
        this.betStore.lastReceivedBet.value = this.betStore.lastReceivedBet.value / 2;
        console.log("handleCashoutHalf", this.cashoutStore.cashOutNotice.value);
    }

    eventHandleList = [
        {
            name: GameCrashServiceMessage.CrashCashoutFull.eventName,
            handle: this.handleCashoutFull,
        },
        {
            name: GameCrashServiceMessage.CrashCashoutHalf.eventName,
            handle: this.handleCashoutHalf,
        },
    ];
}
