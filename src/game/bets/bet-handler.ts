import { inject, injectable } from "inversify";

import { MainPlayerStore } from "../../players";
import { GameClientEmitMessage } from "../../shared";
import { Translator } from "../../shared/utils/localization-manager";
import { ConnectionHandlers, ConnectionStore } from "../connection";
import { GameSetting } from "../game-configs/game-setting";
import { NoticeStore } from "../notices";
import { OrientationStore } from "../orientation";
import { ROUND_STATE, RoundTimeStore } from "../rounds";
import { BetStore } from "./bet-store";

@injectable()
export class BetHandler {
    constructor(
        @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(OrientationStore) private readonly orientationStore: OrientationStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(NoticeStore) private readonly noticeStore: NoticeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(GameSetting) private readonly gameSetting: GameSetting
    ) {}

    handle(betChoice: string) {
        if (this.isInPhasePreventBet()) {
            return;
        }

        const { amount, freebetEnabled, isProcessingBet } = this.betStore;
        if (isProcessingBet) {
            this.showWarningProcessingBet();
            return;
        }
        const availableBalance = this.betStore.availableBalance;

        if (this.gameSetting?.validateBalanceWhenBet && amount > availableBalance) {
            this.showNoticePlaceBetFailure(freebetEnabled);
            return;
        }

        this.betStore.isProcessingBet = true;
        const betData = {
            m: this.orientationStore.m,
            username: this.mainPlayerStore.name,
            betChoice,
            amount,
            freeBet: freebetEnabled,
        };
        this.connectionStore.send(GameClientEmitMessage.Bet.eventName, betData);
        this.retryGameHandler.handle();
    }

    showNoticePlaceBetFailure(freebetEnabled: boolean) {
        const message = freebetEnabled ? Translator.commonTranslate("not_enough_scoin") : Translator.commonTranslate("not_enough_money");
        this.noticeStore.addWarning(message);
    }

    showWarningProcessingBet() {
        this.noticeStore.addProcessWarning(Translator.commonTranslate("message_processing_action"));
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
