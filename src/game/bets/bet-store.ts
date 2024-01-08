import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface IStakeLevel {
    minBet: number;
    maxBet: number;
}

export interface ILastReceivedBet {
    value: number;
    isAnimated: boolean;
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

    private _lastReceivedBet: ILastReceivedBet = null;

    isProcessingBet = false;

    get lastReceivedBet() {
        return this._lastReceivedBet;
    }

    set lastReceivedBet(lastReceivedBet: ILastReceivedBet) {
        this._lastReceivedBet = lastReceivedBet;
    }
}
