import { inject, injectable } from "inversify";

import { PlayerStore } from "../../players";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { ConnectionStore } from "../connection";
import { NoticeStore } from "../notice";
import { OrientationStore } from "../orientation";
import { BetStore } from "./bet-store";

@injectable()
export class BetHandler implements IHandler<string> {
    constructor(
        @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(PlayerStore) private readonly playerStore: PlayerStore,
        @inject(OrientationStore) private readonly orientationStore: OrientationStore,
        @inject(NoticeStore) private readonly noticeStore: NoticeStore
    ) {}

    handle(betChoice: string) {
        const { amount, freebetEnabled } = this.betStore;
        const availableBalance = freebetEnabled ? this.playerStore.scoin : this.playerStore.balance;

        if (amount > availableBalance) {
            this.showNoticePlaceBetFailure(freebetEnabled);
            return;
        }

        const betData = {
            m: this.orientationStore.m,
            username: this.playerStore.name,
            betChoice,
            amount,
            freeBet: freebetEnabled,
        };
        this.connectionStore.send(GameClientEmitMessage.Bet.eventName, betData);
    }

    showNoticePlaceBetFailure(freebetEnabled: boolean) {
        const message = freebetEnabled ? "Not enough Scoin to place bet." : "Your account has insufficient funds.";
        this.noticeStore.addWarning(message);
    }
}
