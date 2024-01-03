import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { RoundHistoryStore } from "../../game/round-histories/round-history-store";
import { RoundTimeStore } from "../../game/rounds";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { AutoPlayHandler, AutoPlayStore } from "../auto-play";
import { CASH_OUT_STATE, GameCrashServiceMessage } from "../game-crash-messages";
import { MultiplierStore } from "../multiplier/multiplier-store";
import { PlayerActionHandlers, PlayerActionStore } from "../player-actions";
import { CrashCashOutStore } from "./crash-cash-out-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    private readonly HalfCashOutRatio = 0.5;
    private readonly FullCashOutRatio = 1;

    constructor(
        @inject(CrashCashOutStore) protected readonly cashOutStore: CrashCashOutStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(MultiplierStore) private readonly multiplierStore: MultiplierStore,
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(PlayerActionHandlers) protected readonly playerActionHandlers: PlayerActionHandlers,
        @inject(AutoPlayHandler) protected readonly autoPlayHandler: AutoPlayHandler,
        @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (isPlacingBet) {
                    this.resetCashOut();
                }
            }
        );

        reaction(
            () => this.multiplierStore.multiplier,
            () => {
                if (this.cashOutStore.isFullCashedOut) return;

                const { multiplier } = this.multiplierStore;
                const { cashOutBet } = this.cashOutStore;

                if (multiplier && !!cashOutBet) {
                    this.cashOutStore.fullCashOutValue = cashOutBet.value * multiplier;

                    if (!this.cashOutStore.isHalfCashedOut) {
                        this.cashOutStore.halfCashOutValue = cashOutBet.value * multiplier * this.HalfCashOutRatio;
                    }
                }
            }
        );
    }

    handleCashOutFull(cashOut: GameCrashServiceMessage.CrashCashOut | undefined, isReceiveOwnBets = false) {
        this.cashOutStore.cashOut = cashOut;
        this.cashOutStore.fullCashOutValue = cashOut.cashOutWin;

        if (!this.cashOutStore.isHalfCashedOut) {
            this.cashOutStore.halfCashOutValue = cashOut.cashOutWin * this.HalfCashOutRatio;
        }

        this.cashOutStore.isFullCashedOut = true;
        this.cashOutStore.isHalfCashedOut = true;
        !isReceiveOwnBets && this.cashOutStore.setCashOutNotice(cashOut);

        setTimeout(() => {
            this.cashOutStore.ratio = this.FullCashOutRatio;
            this.playerActionStore.cashOutState = CASH_OUT_STATE.FULL;

            if (this.autoPlayStore.isAutoPlay) {
                this.autoPlayHandler.autoEnableEarlyBet();
            } else {
                this.playerActionHandlers.changeButtonBetNextRound();
            }
        }, 2700);
    }

    handleCashOutHalf(cashOut: GameCrashServiceMessage.CrashCashOut | undefined, isReceiveOwnBets = false) {
        this.cashOutStore.halfCashOut = cashOut;
        this.cashOutStore.halfCashOutValue = cashOut.cashOutWin;
        this.cashOutStore.isHalfCashedOut = true;

        !isReceiveOwnBets && this.cashOutStore.setCashOutNotice(cashOut);
        this.cashOutStore.ratio = this.HalfCashOutRatio;
        this.cashOutStore.cashOutBet = { value: this.cashOutStore.cashOutBet.value * this.HalfCashOutRatio };
    }

    handleOwnBets(ownBets: GameCrashServiceMessage.CrashOwnBets) {
        if (!ownBets) {
            return;
        }

        this.betStore.lastReceivedBet = { value: ownBets.amount, isAnimated: false };
        this.betStore.isReceivedBet = true;

        this.cashOutStore.cashOutBet = { value: ownBets.amount };
        ownBets.halfCashOut && this.handleCashOutHalf(ownBets.halfCashOut, true);

        if (ownBets.cashOut) {
            this.handleOwnBetsWhenUserCashedOut(ownBets);
        } else {
            this.handleOwnBetsWhenUserNotCashOut(ownBets);
        }
    }

    private handleOwnBetsWhenUserCashedOut(ownBets: GameCrashServiceMessage.CrashOwnBets) {
        this.cashOutStore.cashOut = ownBets.cashOut;
        this.cashOutStore.fullCashOutValue = ownBets.cashOut.cashOutWin;
        this.betStore.isReceivedBet = false;

        this.resetCashOut();
    }

    private handleOwnBetsWhenUserNotCashOut(ownBets: GameCrashServiceMessage.CrashOwnBets) {
        // join game when user does not cash out, game show explosion animation and result
        const multiplier = +(this.roundHistoryStore.getLastRound()?.result || 0);
        const isResultPhase = this.roundTimeStore.roundTime > this.roundTimeStore.placingBet;

        if (!ownBets.halfCashOut && multiplier && isResultPhase) {
            const fullValue = multiplier * ownBets.amount;
            this.cashOutStore.fullCashOutValue = fullValue;
            this.cashOutStore.halfCashOutValue = fullValue * this.HalfCashOutRatio;
            this.multiplierStore.isCrashed = true;
        }
    }

    private resetCashOut() {
        this.cashOutStore.isFullCashedOut = false;
        this.cashOutStore.isHalfCashedOut = false;
        this.cashOutStore.ratio = this.FullCashOutRatio;
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
