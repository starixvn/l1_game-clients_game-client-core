import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { GameConfigStore } from "../../game/game-configs";
import { RoundHistoryStore } from "../../game/round-histories/round-history-store";
import { RoundTimeStore } from "../../game/rounds";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { AutoPlayHandler, AutoPlayStore } from "../auto-play";
import { ButtonState, GameCrashServiceMessage } from "../game-crash-messages";
import { MultiplierStore } from "../multiplier/multiplier-store";
import { PlayerActionHandlers, PlayerActionStore } from "../player-actions";
import { CrashCashOutStore } from "./crash-cash-out-store";

@injectable()
export class CrashCashOutHandlers implements IMultipleHandlers {
    private readonly halfCashOutRatio = 0.5;
    private readonly fullCashOutRatio = 1;

    private readonly displayCashedOutDuration = 2700;

    constructor(
        @inject(CrashCashOutStore) protected readonly cashOutStore: CrashCashOutStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(MultiplierStore) private readonly multiplierStore: MultiplierStore,
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(PlayerActionHandlers) protected readonly playerActionHandlers: PlayerActionHandlers,
        @inject(AutoPlayHandler) protected readonly autoPlayHandler: AutoPlayHandler,
        @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore,
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore
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
                if (this.cashOutStore.isFullCashedOut) {
                    return;
                }

                const { multiplier } = this.multiplierStore;
                const { cashOutBet } = this.cashOutStore;

                if (multiplier && !!cashOutBet) {
                    this.cashOutStore.fullCashOutValue = cashOutBet.value * multiplier;

                    if (!this.cashOutStore.isHalfCashedOut) {
                        this.cashOutStore.halfCashOutValue = cashOutBet.value * multiplier * this.halfCashOutRatio;
                    }
                }
            }
        );
    }

    private handleCashOutHalf(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.handleHalfCashOutMessage(cashOut);
        this.cashOutStore.setCashOutNotice(cashOut);
    }

    private handleHalfCashOutMessage(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.cashOutStore.halfCashOut = cashOut;
        this.setHalfCashedOutValue(cashOut.cashOutWin);

        this.cashOutStore.ratio = this.halfCashOutRatio;

        this.cashOutStore.cashOutBet = { value: this.cashOutStore.cashOutBet.value * this.halfCashOutRatio };
    }

    private handleCashOutFull(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.handleCashOutMessage(cashOut);
        this.cashOutStore.setCashOutNotice(cashOut);

        setTimeout(() => {
            this.hideCashOut();
        }, this.displayCashedOutDuration);
    }

    private handleCashOutMessage(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.cashOutStore.cashOut = cashOut;
        this.setFullCashedOutValue(cashOut.win);

        if (!this.cashOutStore.isHalfCashedOut) {
            this.setHalfCashedOutValue(cashOut.cashOutWin * this.halfCashOutRatio);
        }
    }

    private setHalfCashedOutValue(value: number) {
        this.cashOutStore.isHalfCashedOut = true;
        this.cashOutStore.halfCashOutValue = value;
    }

    private setFullCashedOutValue(value: number) {
        this.cashOutStore.isFullCashedOut = true;
        this.cashOutStore.fullCashOutValue = value;
    }

    private hideCashOut() {
        this.cashOutStore.ratio = this.fullCashOutRatio;

        this.playerActionHandlers.changeButtonBetNextRound();
    }

    private handleOwnBets(ownBets: GameCrashServiceMessage.CrashOwnBets) {
        if (!ownBets) {
            return;
        }

        this.betStore.lastReceivedBet = { value: ownBets.amount, isAnimated: false };
        this.cashOutStore.cashOutBet = { value: ownBets.amount };

        if (ownBets.halfCashOut) {
            this.handleHalfCashOutMessage(ownBets.halfCashOut);
        }

        if (ownBets.cashOut) {
            this.handleCashOutMessage(ownBets.cashOut);
            return;
        }

        const callHandleCrashed = () => {
            if (this.roundTimeStore.initialized && this.gameConfigStore.initialized) {
                this.handleCrashed();
            } else {
                setTimeout(callHandleCrashed, 50);
            }
        };

        callHandleCrashed();
    }

    private handleCrashed() {
        const isResultPhase = this.roundTimeStore.roundTime > this.roundTimeStore.placingBet;
        if (!isResultPhase) {
            return;
        }

        this.playerActionStore.buttonState = ButtonState.CASH_OUT;
        this.multiplierStore.multiplier = +(this.roundHistoryStore.getLastRound()?.result || 0);

        if (!this.cashOutStore.isHalfCashedOut && this.multiplierStore.multiplier) {
            const amount = this.cashOutStore.cashOutBet.value;
            this.cashOutStore.fullCashOutValue = amount * this.multiplierStore.multiplier;
            this.cashOutStore.halfCashOutValue = amount * this.multiplierStore.multiplier * this.halfCashOutRatio;
        }
    }

    private resetCashOut() {
        this.cashOutStore.isFullCashedOut = false;
        this.cashOutStore.isHalfCashedOut = false;

        this.cashOutStore.cashOut = null;
        this.cashOutStore.halfCashOut = null;

        this.cashOutStore.ratio = this.fullCashOutRatio;
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
