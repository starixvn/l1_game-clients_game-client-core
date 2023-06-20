import { inject, injectable } from "inversify";
import { makeAutoObservable, toJS } from "mobx";
import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { NumberUtils } from "../../shared/utils";
import { GameConfigStore } from "../game-configs";
import { RoundStore, RoundTimeStore } from "../rounds";

export interface IChipGroup {
    [chipValue: string]: number;
}

export interface TChipsByMainPlayerRate {
    chips: {
        [choiceName: string]: IChipGroup;
    };
    isShow: boolean;
}
@injectable()
export class ChipStore {
    constructor(
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
    ) {
        makeAutoObservable(this);
    }

    private _chips: GameServiceMessage.Chips = {};
    private _playerChip: GameServiceMessage.PlayerChip = null;
    private _ownChip: GameServiceMessage.OwnChip = { betChoice: "", amount: 0 };

    get ownChip() {
        return this._ownChip;
    }

    set ownChip(data: GameServiceMessage.OwnChip) {
        this._ownChip = data;
    }

    get chips() {
        return toJS(this._chips);
    }

    set chips(chips: GameServiceMessage.Chips) {
        this._chips = chips;
    }

    get playerChip() {
        return toJS(this._playerChip);
    }

    set playerChip(playerChip: GameServiceMessage.PlayerChip) {
        this._playerChip = playerChip;
    }

    resetChips() {
        this.chips = {};
        this.playerChip = null;
        this.ownChip = { betChoice: "", amount: 0 };
    }

    get chipsByMainPlayerRate(): TChipsByMainPlayerRate {
        const chipsByMainPlayerRate: TChipsByMainPlayerRate = { chips: {}, isShow: true };

        if (this.roundTimeStore.isDisplayingResultState) {
            chipsByMainPlayerRate.isShow = false;
        }

        if (this.chips) {
            for (const rate in this.chips) {
                const chipsByChoiceName = this.chips[rate];
                const choiceNames = Object.keys(chipsByChoiceName);

                for (const name of choiceNames) {
                    const chipGroup = chipsByChoiceName[name];

                    if (chipGroup) {
                        const chipValueConvert = this.convertChipToPlayerRate(chipGroup, this.mainPlayerStore.rate, +rate);
                        chipsByMainPlayerRate.chips[name] = chipValueConvert;
                    }
                }
            }
        }

        return chipsByMainPlayerRate;
    }

    convertChipToPlayerRate(chipGroup: IChipGroup, playerRate: number, chipRate: number) {
        const chipValueConvert: IChipGroup = {};
        for (const chipValue in chipGroup) {
            const convertChipValue = NumberUtils.getValueByCurrency(+chipValue, playerRate, chipRate);

            chipValueConvert[convertChipValue] = chipGroup[chipValue];
        }

        return chipValueConvert;
    }

    get chipValuesByStakeLevel() {
        return this.gameConfigStore.chips
            .map((chip) => +chip)
            .filter((value) => value >= this.roundStore.minBet && value <= this.roundStore.maxBet);
    }
}
