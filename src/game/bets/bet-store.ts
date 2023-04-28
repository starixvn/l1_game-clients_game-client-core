import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface IStakeLevel {
    minBet: number;
    maxBet: number;
}

@injectable()
export class BetStore {
    constructor() {
        makeAutoObservable(this);
    }

    amount = 1;
    freebetEnabled = false;
}
