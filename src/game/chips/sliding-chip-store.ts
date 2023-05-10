import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { PlayerStore } from "../../players";
import { GameConfigStore } from "../game-configs";

@injectable()
export class SlidingChipStore {
    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(PlayerStore) protected readonly playerStore: PlayerStore
    ) {
        makeAutoObservable(this);
    }

    private _chipValues: number[] = [];
    chipsLength = 0;
    isResetScrollViewOffset = false;
    private _currentBet = "";
    private _selectChip = 0;

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
    }

    handleClickPrev(step: number) {
        this._selectChip -= step;
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

    handleSelectChip(disPlayMin: number, displaySize: number) {
        if (this.selectChip < disPlayMin) {
            const selectedIndex = disPlayMin;
            this.selectChip = Math.min(selectedIndex, this.chipsLength - displaySize);
        } else if (this.selectChip > disPlayMin + displaySize - 1) {
            this.selectChip = disPlayMin + displaySize - 1;
        }
    }
}
