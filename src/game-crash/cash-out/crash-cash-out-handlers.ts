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
    handleCashOutFull(cashOut: GameCrashServiceMessage.CrashCashOut | undefined, isReceiveOwnBets = false) {
        this.cashOutStore.cashOut = cashOut;
        this.cashOutStore.isCashedOutFull = true;
        this.cashOutStore.isCashedOutHalf = true;
        !isReceiveOwnBets && this.cashOutStore.setCashOutNotice(cashOut);
        setTimeout(() => {
            this.cashOutStore.ratio = 1;
        }, 2700);
    }

    handleCashOutHalf(cashOut: GameCrashServiceMessage.CrashCashOut | undefined, isReceiveOwnBets = false) {
        this.cashOutStore.halfCashOut = cashOut;
        this.cashOutStore.isCashedOutHalf = true;
        !isReceiveOwnBets && this.cashOutStore.setCashOutNotice(cashOut);
        this.cashOutStore.ratio = 0.5;
        this.cashOutStore.cashOutBet = { value: this.cashOutStore.cashOutBet.value / 2 };
    }

    handleOwnBets(ownBets: GameCrashServiceMessage.CrashOwnBets) {
        if (!ownBets) {
            return;
        }

        if (ownBets.amount) {
            this.betStore.lastReceivedBet = { value: ownBets.amount, isAnimated: false };
            this.betStore.isReceivedBet = true;
        }

        this.cashOutStore.cashOutBet = { value: ownBets.amount };
        ownBets.halfCashOut && this.handleCashOutHalf(ownBets.halfCashOut, true);

        if (ownBets.cashOut) {
            this.cashOutStore.cashOut = ownBets.cashOut;
            this.betStore.isReceivedBet = false;
            // user cashed out, not show full and half cash out buttons
            this.cashOutStore.isCashedOutFull = false;
            this.cashOutStore.isCashedOutHalf = false;
            this.cashOutStore.ratio = 1;
        }
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
