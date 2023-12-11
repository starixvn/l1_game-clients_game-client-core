import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { RoundTimeStore } from "../../game/rounds";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashOutStore } from "./crash-cash-out-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    constructor(
        @inject(CrashCashOutStore) protected readonly cashOutStore: CrashCashOutStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) protected readonly betStore: BetStore
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

    handleOwnBets(ownBets: GameServiceMessage.OwnBets) {
        this.cashOutStore.isCashedOutFull = !!ownBets.cashOut;
        this.cashOutStore.isCashedOutHalf = !!ownBets.halfCashOut;
        this.cashOutStore.cashOutBet = { value: ownBets.amount };
        ownBets.amount && (this.betStore.isReceivedBet = true);
        ownBets.halfCashOut && this.handleCashOutHalf(ownBets.halfCashOut as undefined as GameCrashServiceMessage.CrashCashOut);
        ownBets.cashOut && this.handleCashOutFull(ownBets.cashOut as undefined as GameCrashServiceMessage.CrashCashOut);
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
        {
            name: GameServiceMessage.OwnBets.eventName,
            handle: this.handleOwnBets,
        },
    ];
}
