import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { IHandler } from "../../shared";
import { ButtonState } from "../game-crash-messages";
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
                this.betStore.isReceivedBet && this.changeButtonState(ButtonState.BET_ACCEPTED);
            }
        );

        reaction(
            () => this.roundTimeStore.roundTime,
            (roundTime) => {
                if (roundTime <= 0) {
                    switch (this.playerActionStore.buttonState) {
                        case ButtonState.BET_ACCEPTED:
                            this.changeButtonState(ButtonState.CASH_OUT);
                            break;
                        case ButtonState.PLACE_BET:
                            this.changeButtonState(ButtonState.BET_NEXT_ROUND);
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
                    this.playerActionStore.buttonState !== ButtonState.BET_ACCEPTED &&
                    this.playerActionStore.buttonState !== ButtonState.CANCEL_BET
                ) {
                    this.changeButtonState(ButtonState.PLACE_BET);
                }
            }
        );

        reaction(
            () => {
                return this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult;
            },
            (showingResult) => {
                if (showingResult) {
                    if (this.playerActionStore.buttonState === ButtonState.PLACE_BET) {
                        this.changeButtonState(ButtonState.BET_NEXT_ROUND);
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

    handleCurrentCashOutStateInStore(action: string) {
        this.playerActionStore.cashOutState = action;
    }

    handleActiveAutoPlayInStore(flag: boolean) {
        this.playerActionStore.activeAutoPlay = flag;
    }

    handleEnableAutoPlayInStore(flag: boolean) {
        this.playerActionStore.enableAutoPlay = flag;
    }

    changeButtonState(state: string) {
        this.playerActionStore.buttonState = state;
    }
}
