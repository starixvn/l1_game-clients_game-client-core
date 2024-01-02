import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { BetInputStore } from "../bet-input/bet-input-store";
import { EarlyBetStore } from "../bet/early-bet-store";
import { BET_STATE } from "../game-crash-messages";
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
        @inject(PlayerActionStore) private readonly playerActionStore: PlayerActionStore
    ) {}

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
            this.autoPlayStore.isAutoPlay = false;
            this.autoPlayStore.roundsAutoPlay = 0;
        }
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
        this.autoPlayStore.autoPlayWhenRocketFly = false;
        this.autoPlayStore.autoPlayWhenPlacingBet = false;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.roundConfirmedOnPopup = this.autoPlayStore.selectedRoundOnPopup;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoPlayStore.isAutoPlay = true;
        this.updateStatusLatestRoundAccepted();
        if (!this.playerActionStore.visibleCashOut && this.playerActionStore.visibleBetNextRound && !this.earlyBetStore.earlyBetEnable) {
            this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.selectedRoundOnPopup - 1;
            this.autoPlayStore.autoPlayWhenRocketFly = true;
        }
        if (this.earlyBetStore.earlyBetEnable) {
            this.checkEarlyBetBeforeAutoPlay(true);
        }
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    decreaseAutoPlayRounds() {
        if (this.autoPlayStore.isAutoPlay) {
            if (this.validateAmount() && this.autoPlayStore.roundsAutoPlay > 0) {
                this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
            } else {
                this.autoPlayStore.isAutoPlay = false;
                this.autoPlayStore.roundsAutoPlay = 0;
            }
        }
    }

    private updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.roundsAutoPlay = rounds;
    }

    checkFinishedPlayMode() {
        if (this.autoPlayStore.roundsAutoPlay === 0 && this.autoPlayStore.isAutoPlay && !this.autoPlayStore.hasEarlyBetBeforeAutoPlay) {
            this.autoPlayStore.isOpenAutoPlayPopup = true;
            this.autoPlayStore.isAutoPlay = false;
        }
    }

    cancelAutoPlay() {
        this.autoPlayStore.roundsAutoPlay = 0;
        this.autoPlayStore.isAutoPlay = false;
        this.autoPlayStore.autoPlayWhenRocketFly = false;
        this.autoPlayStore.autoPlayWhenPlacingBet = false;
    }

    checkEarlyBetBeforeAutoPlay(value: boolean) {
        this.autoPlayStore.hasEarlyBetBeforeAutoPlay = value;
    }

    updatedAutoPlayWhenPlacingBet(value: boolean) {
        this.autoPlayStore.autoPlayWhenPlacingBet = value;
    }

    updatedAutoPlayWhenRocketFly(value: boolean) {
        this.autoPlayStore.autoPlayWhenRocketFly = value;
    }

    updateStatusLatestRoundAccepted() {
        this.autoPlayStore.latestRoundAccepted = this.autoPlayStore.roundsAutoPlay === 0;
    }
}
