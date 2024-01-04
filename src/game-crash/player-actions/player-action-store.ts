import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { AutoPlayStore } from "../auto-play/auto-play-store";
import { ButtonState } from "../game-crash-messages";

@injectable()
export class PlayerActionStore {
    constructor(
        @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        makeAutoObservable(this);
    }

    private _endShowCashOutNotice = false;

    private _activeAutoPlay = false;

    private _enableAutoPlay = false;

    private _buttonState = ButtonState.PLACE_BET;

    set buttonState(state: string) {
        this._buttonState = state;
    }

    get buttonState(): string {
        return this._buttonState;
    }

    get enableAutoPlay() {
        return this._enableAutoPlay;
    }

    set enableAutoPlay(value: boolean) {
        this._enableAutoPlay = value;
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

    get visibleAutoCashOut() {
        return this.visibleBetNextRound || !this.visibleCashOut;
    }

    get disableBetAmount() {
        return this.buttonState !== ButtonState.PLACE_BET && this.buttonState !== ButtonState.BET_NEXT_ROUND;
    }

    get activeAutoPlayCurrentRound() {
        return this.enableAutoPlay && this.roundTimeStore.isPlacingBet && !this.roundTimeStore.isLocking && !this.activeAutoPlay;
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
}
