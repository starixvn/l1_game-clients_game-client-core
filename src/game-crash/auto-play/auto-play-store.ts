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

    private _latestRoundAccepted = false;

    skipDecreaseAutoPlayCount = false;

    get isValidAutoPlay() {
        return this.isAutoPlay && this.roundsAutoPlay > 0;
    }

    get latestRoundAccepted(): boolean {
        return this._latestRoundAccepted;
    }

    set latestRoundAccepted(status: boolean) {
        this._latestRoundAccepted = status;
    }

    get hideArrowIcon() {
        return this.isAutoPlay && !this.latestRoundAccepted;
    }

    set roundConfirmedOnPopup(rounds: number) {
        this._roundConfirmedOnPopup = rounds;
    }

    get roundConfirmedOnPopup(): number {
        return this._roundConfirmedOnPopup;
    }
}
