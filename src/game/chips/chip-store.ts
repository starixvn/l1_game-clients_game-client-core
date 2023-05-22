import { inject, injectable } from "inversify";
import { makeAutoObservable, toJS } from "mobx";
import { GameServiceMessage } from "../../shared/models/game-messages";
import { RoundTimeStore } from "../rounds";

export type Chips = {
    [rate: string]: {
        [betChoice: string]: {
            [chipValue: string]: number;
        };
    };
};
@injectable()
export class ChipStore {
    constructor(@inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore) {
        makeAutoObservable(this);
    }

    private _chips: Chips = {};
    playerChip: GameServiceMessage.PlayerChip = null;
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

    set chips(chips: Chips) {
        this._chips = chips;
    }

    resetChips() {
        this.chips = {};
    }
}
