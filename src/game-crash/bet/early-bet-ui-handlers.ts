import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { BetInputStore } from "../bet-input/bet-input-store";
import { RoundState } from "../game-crash-messages";
import { PlayerActionStore } from "../player-actions";
import { EarlyBetStore } from "./early-bet-store";

@injectable()
export class EarlyBetUIHandlers implements IHandler<boolean> {
    constructor(
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore,
        @inject(BetInputStore) private readonly betInputStore: BetInputStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(PlayerActionStore) private readonly playerActionStore: PlayerActionStore
    ) {}

    handle(enable: boolean) {
        this.earlyBetStore.betAmount = this.betInputStore.betAmount;
        this.validateBalance(enable);
    }

    validateBalance(enable: boolean) {
        const { freebetEnabled } = this.betStore;
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;
        if (this.earlyBetStore.betAmount > availableBalance && enable) {
            const message = freebetEnabled
                ? Translator.commonTranslate("not_enough_scoin")
                : Translator.commonTranslate("not_enough_money");
            this.noticeStore.addWarning(message);
        } else {
            this.earlyBetStore.earlyBet = enable;
            this.playerActionStore.roundState = RoundState.CANCEL_BET;
        }
    }
}
