import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { AutoPlayStore } from "../auto-play/auto-play-store";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { ButtonState, RocketState } from "../game-crash-messages";
import { MultiplierStore } from "../multiplier/multiplier-store";

@injectable()
export class PlayerActionStore {
    constructor(
        @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(MultiplierStore) protected readonly multiplierStore: MultiplierStore,
        @inject(CrashCashOutStore) protected readonly cashOutStore: CrashCashOutStore
    ) {
        makeAutoObservable(this);
    }

    private _endShowCashOutNotice = false;

    private _activeAutoPlay = false;

    private _buttonState = ButtonState.PLACE_BET;

    set buttonState(state: string) {
        this._buttonState = state;
    }

    get buttonState(): string {
        return this._buttonState;
    }

    get activeAutoPlay() {
        return this._activeAutoPlay;
    }

    set activeAutoPlay(value: boolean) {
        this._activeAutoPlay = value;
    }

    get endShowCashOutNotice(): boolean {
        return this._endShowCashOutNotice;
    }

    set endShowCashOutNotice(flag: boolean) {
        this._endShowCashOutNotice = flag;
    }

    get visibleBetNextRound() {
        return this.buttonState === ButtonState.BET_NEXT_ROUND;
    }

    get visibleCashOut() {
        return this.buttonState === ButtonState.CASH_OUT;
    }

    get disableBetAmount() {
        return this.buttonState !== ButtonState.PLACE_BET && this.buttonState !== ButtonState.BET_NEXT_ROUND;
    }

    get autoEarlyBet() {
        return this.autoPlayStore.isAutoPlay && this.autoPlayStore.roundsAutoPlay > 0;
    }

    get latestRound() {
        return this.autoPlayStore.isAutoPlay && this.autoPlayStore.roundsAutoPlay === 0;
    }

    get disabledWaitingBet() {
        return this.roundTimeStore.isPlacingBet && this.buttonState === ButtonState.CANCEL_BET;
    }

    get disabledAutoCashout() {
        return this.buttonState === ButtonState.BET_ACCEPTED || this.buttonState === ButtonState.CASH_OUT || this.disabledWaitingBet;
    }

    get disabledCashOut() {
        return (
            (this.roundTimeStore.isPlacingBet && this.buttonState === ButtonState.CASH_OUT) ||
            this.multiplierStore.rocketState === RocketState.CRASHED ||
            this.multiplierStore.rocketState === RocketState.ONLAND
        );
    }

    get disabledFullCashOut() {
        return this.disabledCashOut || this.cashOutStore.isFullCashedOut;
    }

    get disabledHalfCashOut() {
        return this.disabledCashOut || this.cashOutStore.isHalfCashedOut || this.cashOutStore.isFullCashedOut;
    }
}
