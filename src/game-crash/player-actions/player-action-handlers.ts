import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { IHandler } from "../../shared";
import { Translator } from "../../shared/utils";
import { RoundState } from "../game-crash-messages";
import { PlayerActionStore } from "./player-action-store";

@injectable()
export class PlayerActionHandlers implements IHandler<boolean> {
    constructor(
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(NoticeStore) private readonly noticeStore: NoticeStore
    ) {
        reaction(
            () => this.betStore.isReceivedBet,
            () => {
                this.betStore.isReceivedBet && this.handleRoundState(RoundState.BET_ACCEPTED);
            }
        );

        reaction(
            () => this.roundTimeStore.isStartPlacingBet,
            (isStartPlacingBet) => isStartPlacingBet && this.handleRoundState(RoundState.PLACE_BET)
        );

        reaction(
            () => this.roundTimeStore.roundTime,
            (roundTime) => {
                if (roundTime <= 0) {
                    switch (this.playerActionStore.roundState) {
                        case RoundState.BET_ACCEPTED:
                            this.handleRoundState(RoundState.CASH_OUT);
                            break;
                        case RoundState.PLACE_BET:
                            this.handleRoundState(RoundState.BET_NEXT_ROUND);
                            break;
                    }
                }
            }
        );

        reaction(
            () => {
                return this.roundTimeStore.isPlacingBet || this.roundTimeStore.isLocking;
            },
            (isPlacingBet) => {
                if (
                    isPlacingBet &&
                    (this.playerActionStore.roundState !== RoundState.BET_ACCEPTED ||
                        this.playerActionStore.roundState !== RoundState.CANCEL_BET)
                ) {
                    this.handleRoundState(RoundState.PLACE_BET);
                }
            }
        );

        reaction(
            () => {
                return this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult;
            },
            (showingResult) => {
                if (showingResult) {
                    if (this.playerActionStore.roundState === RoundState.PLACE_BET) {
                        this.handleRoundState(RoundState.BET_NEXT_ROUND);
                    }
                }
            }
        );
    }

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

    handleRoundState(state: string) {
        this.playerActionStore.roundState = state;
    }
}
