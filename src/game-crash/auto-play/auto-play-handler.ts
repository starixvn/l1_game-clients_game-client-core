import { inject, injectable } from "inversify";

import { reaction } from "mobx";
import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { BetInputStore } from "../bet-input/bet-input-store";
import { CrashBetHandler } from "../bet/crash-bet-handler";
import { EarlyBetStore } from "../bet/early-bet-store";
import { BET_STATE, ButtonState } from "../game-crash-messages";
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
        @inject(CrashBetHandler) private readonly crashBetHandler: CrashBetHandler
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (!isPlacingBet || !(this.autoPlayStore.isAutoPlay || this.earlyBetStore.earlyBetEnable)) {
                    return;
                }

                if (this.checkFinishedAutoPlay()) {
                    console.log("finish auto play");
                    this.autoPlayStore.isAutoPlay = false;
                    this.earlyBetStore.earlyBetEnable = false;
                    return;
                }

                if (!this.autoPlayStore.skipDecreaseAutoPlayCount) {
                    this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
                }
                this.autoPlayStore.skipDecreaseAutoPlayCount = false;
                this.crashBetHandler.autoPlaceBet();
                this.earlyBetStore.earlyBetEnable = false;
            }
        );
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

    checkAutoPlayClick() {
        if (!this.autoPlayStore.isAutoPlay && this.validateAmount()) {
            this.openAutoPlayPopup();
        } else {
            this.cancelAutoPlay();
        }
    }

    private cancelAutoPlay() {
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
                this.playerActionStore.betState = BET_STATE.NONE;
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
        this.autoPlayStore.isAutoPlay = true;
        this.updateStatusLatestRoundAccepted();
        this.handleDecreaseRoundAtConfirm();
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    handleDecreaseRoundAtConfirm() {
        if (this.validateAmount() && this.autoPlayStore.roundsAutoPlay > 0) {
            if (this.roundTimeStore.isLocking || this.playerActionStore.buttonState === ButtonState.BET_ACCEPTED) {
                this.earlyBetStore.earlyBetEnable = true;
            } else if (this.roundTimeStore.isPlacingBet) {
                this.crashBetHandler.autoPlaceBet();
                this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
            } else if (this.playerActionStore.buttonState === ButtonState.BET_NEXT_ROUND) {
                this.autoEnableEarlyBet();
            } else if (this.playerActionStore.buttonState === ButtonState.CANCEL_BET) {
                this.autoPlayStore.skipDecreaseAutoPlayCount = true;
            }
        } else {
            this.cancelAutoPlay();
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
        const enable = !this.earlyBetStore.earlyBetEnable;
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
                this.cancelAutoPlay();
                return;
            }
        }

        this.changeEarlyBetButton(enable);
        if (!enable) {
            this.cancelAutoPlay();
        }
    }

    changeEarlyBetButton(enable: boolean) {
        console.log("changeEarlyBetButton ", enable);
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
}
