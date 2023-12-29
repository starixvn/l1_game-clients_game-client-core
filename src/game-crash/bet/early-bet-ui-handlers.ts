import { inject, injectable } from "inversify";

import { reaction } from "mobx";
import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds";
import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { AutoPlayHandler } from "../auto-play";
import { BetInputStore } from "../bet-input/bet-input-store";
import { ButtonState } from "../game-crash-messages";
import { PlayerActionStore } from "../player-actions";
import { CrashBetHandler } from "./crash-bet-handler";
import { EarlyBetStore } from "./early-bet-store";

@injectable()
export class EarlyBetUIHandlers implements IHandler<boolean> {
    constructor(
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore,
        @inject(BetInputStore) private readonly betInputStore: BetInputStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(PlayerActionStore) private readonly playerActionStore: PlayerActionStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(CrashBetHandler) private readonly crashBetHandler: CrashBetHandler,
        @inject(AutoPlayHandler) private readonly autoPlayHandler: AutoPlayHandler
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (isPlacingBet && this.earlyBetStore.earlyBetEnable) {
                    this.crashBetHandler.autoPlaceBet();
                }
            }
        );
    }

    showMsgMinBet() {
        this.noticeStore.addWarning(Translator.commonTranslate("message_min_bet_notice", { minBet: this.betInputStore.minBet }));
    }

    handle() {
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

    cancelAutoPlay() {
        this.autoPlayHandler.cancelAutoPlay();
    }
}
