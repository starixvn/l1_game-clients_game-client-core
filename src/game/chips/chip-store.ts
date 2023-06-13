import { inject, injectable } from "inversify";
import { makeAutoObservable, toJS } from "mobx";
import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { NumberUtils } from "../../shared/utils";

export interface IChipAmount {
    [chipValue: string]: number;
}

export interface TChipsByCurrency {
    [choiceName: string]: IChipAmount;
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

    get chipsByCurrency(): TChipsByCurrency {
        const newChips = {};
        for (const rate in this.chips) {
            const chipValues = this.chips[rate];
            const betChoices = Object.keys(chipValues);
            for (const betChoice of betChoices) {
                const chipAmount = chipValues[betChoice];
                if (chipAmount) {
                    const chipAmountConvert = this.convertChipValueFollowCurrency(chipAmount, this.mainPlayerStore.rate, +rate);
                    newChips[betChoice] = chipAmountConvert;
                }
            }
        }

        return newChips;
    }

    convertChipValueFollowCurrency(chipAmount: IChipAmount, playerRate: number, chipRate: number) {
        const chipAmountConvert: IChipAmount = {};
        for (const chipValue in chipAmount) {
            const convertChipValue = NumberUtils.getValueByCurrency(+chipValue, playerRate, chipRate);

            chipAmountConvert[convertChipValue] = chipAmount[chipValue];
        }

        return chipAmountConvert;
    }
}
