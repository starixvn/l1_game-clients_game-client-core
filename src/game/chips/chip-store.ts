import { inject, injectable } from "inversify";
import { makeAutoObservable, toJS } from "mobx";
import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { NumberUtils } from "../../shared/utils";

export interface IChipGroup {
    [chipValue: string]: number;
}

export interface TChipsByMainPlayerRate {
    [choiceName: string]: IChipGroup;
}
@injectable()
export class ChipStore {
    constructor(@inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore) {
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
        const chipsByMainPlayerRate = {};
        for (const rate in this.chips) {
            const chipsByChoiceName = this.chips[rate];
            const choiceNames = Object.keys(chipsByChoiceName);
            for (const name of choiceNames) {
                const chipGroup = chipsByChoiceName[name];
                if (chipGroup) {
                    const chipValueConvert = this.convertChipToPlayerRate(chipGroup, this.mainPlayerStore.rate, +rate);
                    chipsByMainPlayerRate[name] = chipValueConvert;
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
}
