import { inject, injectable } from "inversify";

import { reaction } from "mobx";
import { BetStore } from "../../game/bets/bet-store";
import { DisabledGameStore } from "../../game/disabled-game";
import { ErrorStore } from "../../game/errors";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { BetInputStore } from "../bet-input/bet-input-store";
import { CrashBetHandler } from "../bet/crash-bet-handler";
import { EarlyBetStore } from "../bet/early-bet-store";
import { ButtonState } from "../game-crash-messages";
import { PlayerActionStore } from "../player-actions/player-action-store";
import { AutoPlayStore } from "./auto-play-store";

@injectable()
export class AutoPlayHandler implements IHandler<number> {
    constructor(
        @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore,
        @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore,
        @inject(BetInputStore) private readonly betInputStore: BetInputStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(NoticeStore) private readonly noticeStore: NoticeStore,
        @inject(PlayerActionStore) private readonly playerActionStore: PlayerActionStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(CrashBetHandler) private readonly crashBetHandler: CrashBetHandler,
        @inject(ErrorStore) private readonly errorStore: ErrorStore,
        @inject(DisabledGameStore) private readonly disabledGameStore: DisabledGameStore
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (!isPlacingBet) {
                    return;
                }
                this.handleAutoPlaceBetAtPlacingBet();
            }
        );
        reaction(
            () => this.errorStore.apiError,
            (apiError) => {
                if (!apiError) {
                    return;
                }
                this.handleCancelAutoPlayWhenApiError();
            }
        );
    }

    handleCancelAutoPlayWhenApiError() {
        this.cancelEarlyBetAndAutoPlay();
        this.resetButtonState();
    }

    handleAutoPlaceBetAtPlacingBet() {
        if (!(this.autoPlayStore.isAutoPlay || this.earlyBetStore.earlyBetEnable)) {
            return;
        }

        if (!this.autoPlayStore.skipDecreaseAutoPlayCount) {
            this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
        }

        this.autoPlayStore.skipDecreaseAutoPlayCount = false;
        this.earlyBetStore.earlyBetEnable = false;

        if (this.checkFinishedAutoPlay() || !this.validateAmount() || this.disabledGameStore.disabled) {
            this.cancelAutoPlay();
            this.playerActionStore.buttonState = ButtonState.PLACE_BET;
        } else {
            this.crashBetHandler.autoPlaceBet();
        }
    }

    checkFinishedAutoPlay() {
        return (
            this.autoPlayStore.isAutoPlay && //
            !this.autoPlayStore.skipDecreaseAutoPlayCount &&
            this.autoPlayStore.roundsAutoPlay <= 0
        );
    }

    handle() {}

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = true;
        if (this.autoPlayStore.roundConfirmedOnPopup !== 0) {
            this.autoPlayStore.selectedRoundOnPopup = this.autoPlayStore.roundConfirmedOnPopup;
        } else {
            this.autoPlayStore.selectedRoundOnPopup = this.autoPlayStore.roundsList[0];
        }
    }

    clickAutoPlay() {
        if (!this.autoPlayStore.isAutoPlay && this.validateAmount()) {
            this.openAutoPlayPopup();
        } else {
            this.cancelAutoPlay();
            this.resetButtonState();
        }
    }

    resetButtonState() {
        if (this.playerActionStore.buttonState === ButtonState.CANCEL_BET) {
            if (this.roundTimeStore.isPlacingBet) {
                this.playerActionStore.buttonState = ButtonState.PLACE_BET;
            } else if (!this.earlyBetStore.earlyBetEnable) {
                this.playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND;
            }
        } else if (this.playerActionStore.buttonState === ButtonState.CASH_OUT && this.roundTimeStore.isPlacingBet) {
            this.playerActionStore.buttonState = ButtonState.PLACE_BET;
        }
    }

    cancelAutoPlay() {
        this.autoPlayStore.isAutoPlay = false;
        this.updateAutoPlayRounds(0);
    }

    cancelEarlyBetAndAutoPlay() {
        this.earlyBetStore.earlyBetEnable = false;
        this.cancelAutoPlay();
    }

    validateAmount() {
        const { freebetEnabled } = this.betStore;
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;
        const minBet = this.betInputStore.minBet;
        if (this.betInputStore.betAmount <= availableBalance) {
            if (!this.betInputStore.betAmountGreaterMinBet) {
                this.noticeStore.addWarning(Translator.commonTranslate("message_min_bet_notice", { minBet: minBet }));
            }
            return this.betInputStore.betAmountGreaterMinBet;
        } else {
            this.noticeStore.addWarning(Translator.commonTranslate("not_enough_money"));
            return false;
        }
    }

    closeAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.roundConfirmedOnPopup = this.autoPlayStore.selectedRoundOnPopup;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        if (this.validateAmount()) {
            this.autoPlayStore.isAutoPlay = true;
            this.updateStatusLatestRoundAccepted();
            this.handleDecreaseRoundAtConfirm();
        } else {
            this.cancelAutoPlay();
        }
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    handleDecreaseRoundAtConfirm() {
        if (this.roundTimeStore.isPlacingBet && this.playerActionStore.buttonState === ButtonState.PLACE_BET) {
            this.crashBetHandler.autoPlaceBet();
            this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
        } else if (this.playerActionStore.buttonState === ButtonState.BET_NEXT_ROUND) {
            this.autoEnableEarlyBet();
        } else if (this.playerActionStore.buttonState === ButtonState.CANCEL_BET) {
            this.autoPlayStore.skipDecreaseAutoPlayCount = true;
        }
    }

    autoEnableEarlyBet() {
        this.changeEarlyBetButton(true);
        this.autoPlayStore.skipDecreaseAutoPlayCount = true;
        this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
    }

    updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.roundsAutoPlay = rounds;
    }

    updateStatusLatestRoundAccepted() {
        this.autoPlayStore.latestRoundAccepted = this.autoPlayStore.roundsAutoPlay === 0;
    }

    showMsgMinBet() {
        this.noticeStore.addWarning(Translator.commonTranslate("message_min_bet_notice", { minBet: this.betInputStore.minBet }));
    }

    clickEarlyBet() {
        const enable = this.playerActionStore.buttonState === ButtonState.BET_NEXT_ROUND;
        if (enable) {
            let isError = false;

            if (!this.validateBalance()) {
                this.showNotEnoughMoney();
                isError = true;
            }

            if (!this.betInputStore.betAmountGreaterMinBet) {
                this.showMsgMinBet();
                isError = true;
            }

            if (isError) {
                return;
            }
        }

        this.changeEarlyBetButton(enable);
        if (!enable) {
            this.cancelAutoPlay();
        }
    }

    changeEarlyBetButton(enable: boolean) {
        this.earlyBetStore.earlyBetEnable = enable;
        this.playerActionStore.buttonState = enable ? ButtonState.CANCEL_BET : ButtonState.BET_NEXT_ROUND;
    }

    private showNotEnoughMoney() {
        const { freebetEnabled } = this.betStore;
        const message = freebetEnabled ? Translator.commonTranslate("not_enough_scoin") : Translator.commonTranslate("not_enough_money");
        this.noticeStore.addWarning(message);
    }

    validateBalance() {
        const { freebetEnabled } = this.betStore;
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;
        return this.betInputStore.betAmount <= availableBalance;
    }

    get isValidAutoPlay() {
        return this.autoPlayStore.isValidAutoPlay && this.validateAmount();
    }
}
