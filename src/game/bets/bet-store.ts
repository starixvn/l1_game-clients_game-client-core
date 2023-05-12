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

    private _amount = 1;
    freebetEnabled = false;

    get amount() {
        return this._amount;
    }

    set amount(amount: number) {
        this._amount = amount;
    }

    lastReceivedBet = 0;
    isProcessingBet = false;
}
