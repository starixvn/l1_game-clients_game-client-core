import { inject, injectable } from "inversify";

import { MainPlayerStore } from "../../players";
import { GameClientEmitMessage } from "../../shared";
import { l10n } from "../../shared/l10n";
import { ConnectionStore } from "../connection";
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
        @inject(NoticeStore) private readonly noticeStore: NoticeStore
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
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;

        if (amount > availableBalance) {
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
    }

    showNoticePlaceBetFailure(freebetEnabled: boolean) {
        const message = freebetEnabled ? l10n.t("notEnoughScoin") : l10n.t("userInsufficientFund");
        this.noticeStore.addWarning(message);
    }

    clearBet() {}

    showWarningProcessingBet() {
        this.noticeStore.addWarning(l10n.t("dataProcessing"));
    }

    isInPhasePreventBet() {
        const isBetPhase = [ROUND_STATE.BEGIN_PLACING_BET, ROUND_STATE.PLACING_BET].includes(this.roundTimeStore.roundState);
        if (!isBetPhase) {
            const warningMsg =
                this.roundTimeStore.roundState === ROUND_STATE.BEGIN_STARTING_ROUND ||
                this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND
                    ? l10n.t("cannotPlaceBet")
                    : l10n.t("placeBetNextRound");

            this.noticeStore.addWarning(warningMsg);
        }

        return !isBetPhase;
    }
}
