import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class CrashCashoutStore {
    isCashedOutFull = false;
    isCashedOutHalf = false;
    ratio = 1;

    cashOutNotice: {
        win: number;
        cashOutWin: number;
        reachMaxWin: boolean;
    } = null;

    private _cashoutBet: { value: number } = null;
    private _cashOut: GameCrashServiceMessage.CrashCashout = null;
    private _halfCashOut: GameCrashServiceMessage.CrashCashout = null;

    constructor() {
        makeAutoObservable(this);
    }

    get cashoutBet() {
        return this._cashoutBet;
    }

    set cashoutBet(cashoutBet: any) {
        this._cashoutBet = cashoutBet;
    }

    set cashOut(data: GameCrashServiceMessage.CrashCashout) {
        this._cashOut = data;
    }

    get cashOut(): GameCrashServiceMessage.CrashCashout {
        return this._cashOut;
    }

    set halfCashOut(data: GameCrashServiceMessage.CrashCashout) {
        this._halfCashOut = data;
    }

    get halfCashOut(): GameCrashServiceMessage.CrashCashout {
        return this._halfCashOut;
    }
}
