import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { GameConfigStore } from "../../game/game-configs";
import { RoundHistoryStore } from "../../game/round-histories/round-history-store";
import { RoundTimeStore } from "../../game/rounds";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { AutoPlayHandler } from "../auto-play";
import { BetInputStore } from "../bet-input/bet-input-store";
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
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(BetInputStore) protected readonly betInputStore: BetInputStore
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
                this.handleMultiplier();
            }
        );
    }

    private handleMultiplier() {
        const winAmount = this.calculateWinAmount();

        if (winAmount <= 0) {
            return;
        }

        this.updateFullCashOutValue(winAmount);
        this.updateHalfCashOutValue(winAmount);
    }

    private calculateWinAmount() {
        const { multiplier } = this.multiplierStore;
        const betAmount = this.betInputStore.betAmountRatio;
        return multiplier > 0 ? betAmount * multiplier : 0;
    }

    private updateFullCashOutValue(winAmount: number) {
        if (this.cashOutStore.isFullCashedOut) {
            return;
        }

        this.cashOutStore.fullCashOutValue = winAmount;
    }

    private updateHalfCashOutValue(winAmount: number) {
        if (this.cashOutStore.isHalfCashedOut) {
            return;
        }

        this.cashOutStore.halfCashOutValue = winAmount * this.halfCashOutRatio;
    }

    private handleCashOutHalf(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.handleHalfCashOutMessage(cashOut);
        this.cashOutStore.setCashOutNotice(cashOut);
    }

    private handleHalfCashOutMessage(cashOut: GameCrashServiceMessage.CrashCashOut | undefined) {
        this.cashOutStore.halfCashOut = cashOut;
        this.setHalfCashedOutValue(cashOut.cashOutWin);

        this.cashOutStore.ratio = this.halfCashOutRatio;
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

        if (!ownBets.cashOut && !ownBets.halfCashOut) {
            this.betStore.lastReceivedBet = { value: ownBets.amount, isAnimated: false };
        }

        if (ownBets.halfCashOut) {
            this.handleHalfCashOutMessage(ownBets.halfCashOut);
            this.playerActionStore.buttonState = ButtonState.CASH_OUT;
        }

        if (ownBets.cashOut) {
            this.handleCashOutMessage(ownBets.cashOut);
            this.playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND;
            return;
        }

        this.callHandleCrashed();
    }

    callHandleCrashed() {
        if (this.roundTimeStore.initialized && this.gameConfigStore.initialized) {
            this.handleCrashed();
        } else {
            setTimeout(() => this.callHandleCrashed(), 50);
        }
    }

    private handleCrashed() {
        console.log("round time", this.roundTimeStore.roundTime);
        if (this.roundTimeStore.roundTime <= this.roundTimeStore.placingBet) {
            return;
        }

        this.playerActionStore.buttonState = ButtonState.CASH_OUT;
        this.betStore.lastReceivedBet = null;

        this.multiplierStore.multiplier = +(this.roundHistoryStore.getLastRound()?.result || 0);

        if (this.multiplierStore.multiplier) {
            this.cashOutStore.fullCashOutValue = this.calculateWinAmount();
            !this.cashOutStore.isHalfCashedOut && (this.cashOutStore.halfCashOutValue = this.calculateWinAmount() * this.halfCashOutRatio);
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
