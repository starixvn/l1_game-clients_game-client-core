import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class AutoPlayStore {
    constructor() {
        makeAutoObservable(this);
    }

    public roundsList = [10, 30, 50, 80, 100, 200, 500, 1000];
    public isOpenAutoPlayPopup = false;
    public selectedRoundOnPopup = this.roundsList[0];
    public roundsAutoPlay = 0;
    public _roundConfirmedOnPopup = 0;

    public isAutoPlay = false;
    private _hasEarlyBetBeforeAutoPlay = false;
    private _autoPlayWhenPlacingBet = false;
    private _autoPlayWhenRocketFly = false;

    private _latestRoundAccepted = false;

    set hasEarlyBetBeforeAutoPlay(value: boolean) {
        this._hasEarlyBetBeforeAutoPlay = value;
    }

    get hasEarlyBetBeforeAutoPlay(): boolean {
        return this._hasEarlyBetBeforeAutoPlay;
    }

    set autoPlayWhenPlacingBet(value: boolean) {
        this._autoPlayWhenPlacingBet = value;
    }

    get autoPlayWhenPlacingBet(): boolean {
        return this._autoPlayWhenPlacingBet;
    }

    get autoPlayWhenRocketFly(): boolean {
        return this._autoPlayWhenRocketFly;
    }

    set autoPlayWhenRocketFly(value: boolean) {
        this._autoPlayWhenRocketFly = value;
    }

    get latestRoundAccepted(): boolean {
        return this._latestRoundAccepted;
    }

    set latestRoundAccepted(status: boolean) {
        this._latestRoundAccepted = status;
    }

    get showHideArrowIcon() {
        return this.isAutoPlay && !this.latestRoundAccepted;
    }

    set roundConfirmedOnPopup(rounds: number) {
        this._roundConfirmedOnPopup = rounds;
    }

    get roundConfirmedOnPopup(): number {
        return this._roundConfirmedOnPopup;
    }
}
