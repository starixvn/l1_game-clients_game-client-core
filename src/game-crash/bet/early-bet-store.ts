import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class EarlyBetStore {
    private _betAmount = -1;

    private _earlyBet = false;

    get betAmount(): number {
        return this._betAmount;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }

    get earlyBet(): boolean {
        return this._earlyBet;
    }

    set earlyBet(trigger: boolean) {
        this._earlyBet = trigger;
    }

    constructor() {
        makeAutoObservable(this);
    }
}
