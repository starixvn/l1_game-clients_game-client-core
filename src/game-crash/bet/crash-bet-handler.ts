import { inject, injectable } from "inversify";
import { BetStore } from "../../game/bets/bet-store";
import { ConnectionHandlers, ConnectionStore } from "../../game/connection";
import { NoticeStore } from "../../game/notices";
import { OrientationStore } from "../../game/orientation";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../../game/rounds";
import { MainPlayerStore } from "../../players";
import { Translator } from "../../shared/utils/localization-manager";
import { AutoCashOutStore } from "../auto-cash-out";
import { BetInputStore } from "../bet-input";
import { GameCrashEmitMessage } from "../game-crash-messages";

@injectable()
export class CrashBetHandler {
    constructor(
        @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(OrientationStore) private readonly orientationStore: OrientationStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(NoticeStore) private readonly noticeStore: NoticeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(RoundStore) private readonly roundStore: RoundStore,
        @inject(AutoCashOutStore) private readonly autoCashOutStore: AutoCashOutStore,
        @inject(BetInputStore) private readonly betInputStore: BetInputStore
    ) {}

    handle(payload: { autoCashOut: number; amount: number }) {
        if (this.isInPhasePreventBet()) {
            return;
        }

        const { autoCashOut, amount } = payload;
        const { freebetEnabled, isProcessingBet } = this.betStore;
        if (isProcessingBet) {
            this.showWarningProcessingBet();
            return;
        }
        const availableBalance = this.betStore.availableBalance;

        if (amount > availableBalance) {
            this.showNoticePlaceBetFailure(freebetEnabled);
            return;
        }

        this.betStore.isProcessingBet = true;
        const betData = {
            m: this.orientationStore.m,
            username: this.mainPlayerStore.name,
            roundId: this.roundStore.clientRoundId,
            autoCashOut,
            clientSendTime: new Date(),
            amount,
            freeBet: freebetEnabled,
        };
        this.connectionStore.send(GameCrashEmitMessage.Bet.eventName, betData);
        this.retryGameHandler.handle();
    }

    showNoticePlaceBetFailure(freebetEnabled: boolean) {
        const message = freebetEnabled ? Translator.commonTranslate("not_enough_scoin") : Translator.commonTranslate("not_enough_money");
        this.noticeStore.addWarning(message);
    }

    showWarningProcessingBet() {
        this.noticeStore.addWarning(Translator.commonTranslate("message_processing_action"));
    }

    isInPhasePreventBet() {
        const isPreventBet = this.roundTimeStore.roundState !== ROUND_STATE.PLACING_BET;

        if (isPreventBet) {
            const isStartingRound = this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND;
            const warningMsg = isStartingRound
                ? Translator.commonTranslate("message_cannot_bet")
                : Translator.commonTranslate("message_placebet_next_round");

            this.noticeStore.addWarning(warningMsg);
        }

        return isPreventBet;
    }

    autoPlaceBet() {
        const payload = {
            autoCashOut: this.autoCashOutStore.enable ? this.autoCashOutStore.multiplier : undefined,
            amount: this.betInputStore.betAmount,
        };
        this.handle(payload);
    }
}
