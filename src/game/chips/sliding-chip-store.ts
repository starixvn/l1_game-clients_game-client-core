import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class SlidingChipStore {
    constructor() {
        makeAutoObservable(this);
    }

    chipValues: number[];
    configValues: number[];
    selected: number;
    onClickNext;
    onClickPrev;
    _currentBetValue: string;
    _disabledBetChips: boolean;
    needResetCurrentChip: boolean;

    readonly chipFlyingTime: number = 0.8;
    readonly loginUserChipFlyingTime: number = 0.5;
    readonly chipDelayFlyingTime: number = 1.25;
    _smallChipScale = 0.29;
    chipSetting;
}
