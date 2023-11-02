import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface IStakeLevel {
    minBet: number;
    maxBet: number;
}

export interface ILastReceivedBet {
    value: number;
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

    private _isReceivedBet = false;
    isProcessingBet = false;
    private _cashoutBet: ILastReceivedBet = null;

    get lastReceivedBet() {
        return this._lastReceivedBet;
    }

    set lastReceivedBet(lastReceivedBet: ILastReceivedBet) {
        this._lastReceivedBet = lastReceivedBet;
    }

    get isReceivedBet() {
        return this._isReceivedBet;
    }

    set isReceivedBet(isReceived: boolean) {
        this._isReceivedBet = isReceived;
    }

    get cashoutBet() {
        return this._cashoutBet;
    }

    set cashoutBet(cashoutBet: ILastReceivedBet) {
        this._cashoutBet = cashoutBet;
    }
}
