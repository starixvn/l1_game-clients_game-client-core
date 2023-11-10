import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class CrashCashoutStore {
    cashOut: GameCrashServiceMessage.CrashCashout;
    halfCashOut: GameCrashServiceMessage.CrashCashout;
    isCashedOutFull = false;
    isCashedOutHalf = false;
    ratio = 1;

    cashOutNotice: {
        value: number;
    } = null;

    private _cashoutBet: { value: number } = null;

    constructor() {
        makeAutoObservable(this);
    }

    get cashoutBet() {
        return this._cashoutBet;
    }

    set cashoutBet(cashoutBet: any) {
        this._cashoutBet = cashoutBet;
    }
}
