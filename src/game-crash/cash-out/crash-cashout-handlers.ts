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
                }
            }
        );
    }
    handleCashoutFull(cashOut: GameCrashServiceMessage.CrashCashoutFull | undefined) {
        this.cashoutStore.cashoutAmount = cashOut.win;
        this.cashoutStore.isCashedOutFull = true;
        this.cashoutStore.isCashedOutHalf = true;
    }

    handleCashoutHalf(cashOut: GameCrashServiceMessage.CrashCashoutHalf | undefined) {
        this.cashoutStore.cashoutAmount = cashOut.win;
        this.cashoutStore.isCashedOutHalf = true;
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
