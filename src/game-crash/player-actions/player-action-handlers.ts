import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { PlayerActionStore } from "./player-action-store";

@injectable()
export class PlayerActionHandlers implements IHandler<boolean> {
    constructor(
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(NoticeStore) private readonly noticeStore: NoticeStore
    ) {}

    handle(flag: boolean) {}

    handleEndShowCashOutNotice(flag: boolean) {
        this.playerActionStore.endShowCashOutNotice = flag;
    }

    handleCurrentBetStateInStore(action: string) {
        this.playerActionStore.betState = action;
    }

    handleCurrentEarlyBetStateInStore(action: string) {
        this.playerActionStore.earlyBetState = action;
    }

    handleWaitingBet(flag: boolean) {
        this.playerActionStore.waitingBet = flag;
    }

    handleCurrentCashOutStateInStore(action: string) {
        this.playerActionStore.cashOutState = action;
    }

    handleActiveAutoPlayInStore(flag: boolean) {
        this.playerActionStore.activeAutoPlay = flag;
    }

    handleEnableAutoPlayInStore(flag: boolean) {
        this.playerActionStore.enableAutoPlay = flag;
    }

    showMsgMinBet(minBet: number) {
        this.noticeStore.addWarning(Translator.commonTranslate("message_min_bet_notice", { minBet: minBet }));
    }
}
