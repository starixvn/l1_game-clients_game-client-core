import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { MainPlayerStore } from "../../players";

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
    constructor(@inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore) {
        makeAutoObservable(this);
    }

    private _amount = 1;
    freebetEnabled = false;

    get availableBalance() {
        return this.freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;
    }

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
