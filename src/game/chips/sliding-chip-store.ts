import { inject, injectable } from "inversify";
import { makeAutoObservable, toJS } from "mobx";
import { PlayerStore } from "../../players";
import { GameConfigStore } from "../game-configs";

export const SCROLL_STATE = {
    SCROLL_BEGAN: "scrollBegan",
    SCROLL_ENDED: "scrollEnded",
    SCROLL_INIT: "scrollInit",
};

@injectable()
export class SlidingChipStore {
    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(PlayerStore) protected readonly playerStore: PlayerStore
    ) {
        makeAutoObservable(this);
    }

    private _chipValues: number[] = [];
    configValues: number[];
    private _selectChip = 0;
    onClickNext = false;
    onClickPrev = false;
    private _disabledBetChips = false;
    needResetCurrentChip: boolean;

    readonly chipFlyingTime: number = 0.8;
    readonly loginUserChipFlyingTime: number = 0.5;
    readonly chipDelayFlyingTime: number = 1.25;
    _smallChipScale = 0.29;
    chipSetting;

    isShowLeftArrow = true;
    isShowRightArrow = true;
    chipsLength = 0;
    private _currentBet = "1";
    isResetScrollViewOffset = false;
    isUpdateSnappedScrollView = false;
    isCreateChips = false;
    scrollState = SCROLL_STATE.SCROLL_INIT;
    isCalculatedPercent = false;

    set selectChip(index: number) {
        this._selectChip = index;
    }
    get selectChip() {
        return this._selectChip;
    }

    onLoad(minChipSelect: number) {
        this._selectChip = minChipSelect;
    }

    handleClickNext(step: number) {
        this._selectChip += step;
        this.onClickNext = true;
        this.onClickPrev = false;
    }

    handleClickPrev(step: number) {
        this._selectChip -= step;
        this.onClickPrev = true;
        this.onClickNext = false;
    }

    resetCurrentChip() {
        this._selectChip = 0;
    }

    set disabledBetChips(status: boolean) {
        this._disabledBetChips = status;
    }

    get disabledBetChips() {
        return this._disabledBetChips;
    }

    set currentBet(value: string) {
        this._currentBet = value;
    }

    get currentBet() {
        return this._currentBet;
    }

    set chipValues(chips: number[]) {
        this._chipValues = chips;
    }

    get chipValues() {
        // this.getChipsByStakeLevel();
        console.log(" this._chipValues-----", toJS(this._chipValues));
        return this._chipValues;
    }

    setChipsByStakeLevel() {
        let minBet = this.gameConfigStore.minBet;
        let maxBet = this.gameConfigStore.maxBet;

        const userStakeLevel = this.playerStore.stakeLevel;
        minBet = Math.max(userStakeLevel.minBet, minBet);
        maxBet = Math.min(userStakeLevel.maxBet, maxBet);
        const result = this.gameConfigStore.chips.map((a) => +a).filter((value) => value >= minBet && value <= maxBet);
        this.chipValues = result;
    }

    handleArrowVisibility() {
        this.isShowLeftArrow = true;
        this.isShowRightArrow = true;

        if (this.selectChip <= 0) {
            this.selectChip = 0;
            this.isShowLeftArrow = false;
        } else if (this.selectChip >= this.chipsLength - 1) {
            this.selectChip = this.chipsLength - 1;
            this.isShowRightArrow = false;
        }
    }

    handleSelectChip(disPlayMin: number, displaySize: number) {
        if (this.selectChip < disPlayMin) {
            const selectedIndex = disPlayMin;
            this.selectChip = Math.min(selectedIndex, this.chipsLength - displaySize);
        } else if (this.selectChip > disPlayMin + displaySize - 1) {
            this.selectChip = disPlayMin + displaySize - 1;
        }
    }
}
