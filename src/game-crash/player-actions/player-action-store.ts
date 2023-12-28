import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { RoundStore } from "../../game/rounds/round-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { AutoPlayStore } from "../auto-play/auto-play-store";
import { EarlyBetStore } from "../bet/early-bet-store";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { BET_STATE, CASH_OUT_STATE, EARLY_BET_STATE, RoundState } from "../game-crash-messages";

@injectable()
export class PlayerActionStore {
    constructor(
        @inject(CrashCashOutStore) protected readonly crashCashoutStore: CrashCashOutStore,
        @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore,
        @inject(EarlyBetStore) protected readonly earlyBetStore: EarlyBetStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
    ) {
        makeAutoObservable(this);
    }

    private _endShowCashOutNotice = false;

    private _waitingBet = false;

    private _activeAutoPlay = false;

    private _enableAutoPlay = false;

    private _earlyBetState = EARLY_BET_STATE.NONE;

    private _cashOutState = CASH_OUT_STATE.NONE;

    private _betState = BET_STATE.NONE;

    private _roundState = RoundState.PLACE_BET;

    set roundState(state: string) {
        this._roundState = state;
    }

    get roundState(): string {
        return this._roundState;
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

    get earlyBetState() {
        return this._earlyBetState;
    }

    set earlyBetState(value: string) {
        this._earlyBetState = value;
    }

    get cashOutState() {
        return this._cashOutState;
    }

    set cashOutState(value: string) {
        this._cashOutState = value;
    }

    get betState() {
        return this._betState;
    }

    set betState(value: string) {
        this._betState = value;
    }

    get endShowCashOutNotice(): boolean {
        return this._endShowCashOutNotice;
    }

    set endShowCashOutNotice(flag: boolean) {
        this._endShowCashOutNotice = flag;
    }

    get visibleBetNextRound() {
        // return (
        //     (this.betState === BET_STATE.NONE &&
        //         (this.isFlyingTime || this.roundTimeStore.isShowResult || this.roundTimeStore.isStartRound)) ||
        //     (this.cashOutState === CASH_OUT_STATE.FULL && this.endShowCashOutNotice)
        // );
        return this.roundState === RoundState.BET_NEXT_ROUND;
    }

    get permissionAutoPlay() {
        return this.cashOutState === CASH_OUT_STATE.FULL && this.betState === BET_STATE.BET;
    }

    get isFlyingTime() {
        return this.roundTimeStore.roundTime <= 0;
    }

    get visibleCashOut() {
        // return (
        //     (this.betState === BET_STATE.BET && this.isFlyingTime && !this.visibleBetNextRound) ||
        //     (this.betState === BET_STATE.BET &&
        //         this.cashOutState !== CASH_OUT_STATE.FULL &&
        //         (this.roundTimeStore.isShowResult || this.roundTimeStore.isStartRound))
        // );
        return this.roundState === RoundState.CASH_OUT;
    }

    get visibleAutoCashOut() {
        return this.visibleBetNextRound || !this.visibleCashOut;
    }

    get disableBetAmount() {
        return (
            this.earlyBetState === EARLY_BET_STATE.BET ||
            this.visibleCashOut ||
            this.autoPlayStore.roundsAutoPlay > 0 ||
            (this.latestRound && this.roundTimeStore.isStartPlacingBet) ||
            (this.betState === BET_STATE.BET && (this.roundTimeStore.isPlacingBet || this.roundTimeStore.isLocking))
        );
    }

    get waitingBet(): boolean {
        return this._waitingBet;
    }

    set waitingBet(enable: boolean) {
        this._waitingBet = enable;
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
}
