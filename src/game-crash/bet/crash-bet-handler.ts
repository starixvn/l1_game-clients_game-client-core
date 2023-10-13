import { inject, injectable } from "inversify";
import { MainPlayerStore } from "../../players";
import { Translator } from "../../shared/utils/localization-manager";
import { ConnectionHandlers, ConnectionStore } from "../../game/connection";
import { NoticeStore } from "../../game/notices";
import { OrientationStore } from "../../game/orientation";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../../game/rounds";
import { BetStore } from "../../game/bets/bet-store";
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
        @inject(RoundStore) private readonly roundStore: RoundStore
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
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;

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

    clearBet() {}

    showWarningProcessingBet() {
        this.noticeStore.addWarning(Translator.commonTranslate("message_processing_action"));
    }

    isInPhasePreventBet() {
        const isBetPhase = [ROUND_STATE.PLACING_BET].includes(this.roundTimeStore.roundState);
        if (!isBetPhase) {
            const isStartingRound = this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND;
            const warningMsg = isStartingRound
                ? Translator.commonTranslate("message_cannot_bet")
                : Translator.commonTranslate("message_placebet_next_round");

            this.noticeStore.addWarning(warningMsg);
        }

        return !isBetPhase;
    }
}
