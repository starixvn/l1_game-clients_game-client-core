import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared/models/game-messages";

export type Chips = {
    [rate: string]: {
        [betChoice: string]: {
            [chipValue: string]: number;
        };
    };
};
@injectable()
export class ChipStore {
    constructor() {
        makeAutoObservable(this);
    }

    chips: Chips = {};
    playerChip: GameServiceMessage.PlayerChip = null;
    ownChip: GameServiceMessage.OwnChip = null;
}
