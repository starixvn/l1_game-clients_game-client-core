import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";
import { BetChoice } from "../baccarat-defines";

export type ChoicesMultipliers = {
    [betChoice: string]: {
        value: number;
        multipliers?: number[];
    };
};

@injectable()
export class BaccaratMultipliersStore<T> {
    constructor() {
        makeAutoObservable(this);
    }

    finalOdds: GameServiceMessage.FinalOdds = {};
    possiblePayout: ChoicesMultipliers = {};
    betChoices: string[] = [BetChoice.Player, BetChoice.PlayerPair, BetChoice.Tie, BetChoice.Banker, BetChoice.BankerPair];
}
