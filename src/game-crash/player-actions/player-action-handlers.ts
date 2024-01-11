import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore, ILastReceivedBet } from "../../game/bets/bet-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { IHandler } from "../../shared";
import { AutoPlayHandler, AutoPlayStore } from "../auto-play";
import { ButtonState } from "../game-crash-messages";
import { PlayerActionStore } from "./player-action-store";

@injectable()
export class PlayerActionHandlers implements IHandler<boolean> {
    constructor(
        @inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore,
        @inject(AutoPlayHandler) private readonly autoPlayHandler: AutoPlayHandler
    ) {
        reaction(
            () => this.betStore.lastReceivedBet,
            (lastReceivedBet) => {
                this.handleReceivedBet(lastReceivedBet);
            }
        );

        reaction(
            () => this.roundTimeStore.roundTime,
            (roundTime) => {
                this.handleFlyingTime(roundTime);
            }
        );

        reaction(
            () => {
                return this.roundTimeStore.isPlacingBet || this.roundTimeStore.isLocking;
            },
            (isPlacingBet) => {
                this.handlePlacingBet(isPlacingBet);
            }
        );

        reaction(
            () => {
                return this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult;
            },
            (showingResult) => {
                this.handleShowingResult(showingResult);
            }
        );
    }

    handle(flag: boolean) {}

    changeButtonBetNextRound() {
        if (this.autoPlayHandler.isValidAutoPlay) {
            this.autoPlayHandler.autoEnableEarlyBet();
        } else {
            this.autoPlayHandler.cancelAutoPlay();
            this.changeButtonState(ButtonState.BET_NEXT_ROUND);
        }
    }

    handleEndShowCashOutNotice(flag: boolean) {
        this.playerActionStore.endShowCashOutNotice = flag;
    }

    handleActiveAutoPlayInStore(flag: boolean) {
        this.playerActionStore.activeAutoPlay = flag;
    }

    changeButtonState(state: string) {
        this.playerActionStore.buttonState = state;
    }

    handleReceivedBet(lastReceivedBet: ILastReceivedBet) {
        const isReceivedBet = lastReceivedBet?.value > 0;
        if (isReceivedBet) {
            if (this.roundTimeStore.isPlacingBet || this.roundTimeStore.isLocking) {
                this.changeButtonState(ButtonState.BET_ACCEPTED);
            }

            if (this.autoPlayStore.roundsAutoPlay === 0) {
                this.autoPlayHandler.cancelAutoPlay();
            }
        } else {
            this.autoPlayHandler.cancelEarlyBetAndAutoPlay();
            this.autoPlayHandler.resetButtonState();
        }
    }

    handleFlyingTime(roundTime: number) {
        if (roundTime > 0) {
            return;
        }

        switch (this.playerActionStore.buttonState) {
            case ButtonState.BET_ACCEPTED:
                this.changeButtonState(ButtonState.CASH_OUT);
                break;
            case ButtonState.PLACE_BET:
                this.changeButtonBetNextRound();
                break;
        }
    }

    handlePlacingBet(isPlacingBet: boolean) {
        if (
            isPlacingBet &&
            this.playerActionStore.buttonState !== ButtonState.BET_ACCEPTED &&
            this.playerActionStore.buttonState !== ButtonState.CANCEL_BET &&
            !this.autoPlayStore.isAutoPlay
        ) {
            this.changeButtonState(ButtonState.PLACE_BET);
        }
    }

    handleShowingResult(showingResult: boolean) {
        if (showingResult) {
            if (this.playerActionStore.buttonState === ButtonState.PLACE_BET) {
                this.changeButtonBetNextRound();
            }
        }
    }
}
