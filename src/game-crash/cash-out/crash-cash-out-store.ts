import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class CrashCashOutStore {
    isCashedOutFull = false;
    isCashedOutHalf = false;
    ratio = 1;

    cashOutNotice: {
        win: number;
        cashOutWin: number;
        reachMaxWin: boolean;
    } = null;

    private _cashOutBet: { value: number } = null;
    private _cashOut: GameCrashServiceMessage.CrashCashOut = null;
    private _halfCashOut: GameCrashServiceMessage.CrashCashOut = null;

    constructor() {
        makeAutoObservable(this);
    }

    get cashOutBet() {
        return this._cashOutBet;
    }

    set cashOutBet(cashOutBet: any) {
        this._cashOutBet = cashOutBet;
    }

    set cashOut(data: GameCrashServiceMessage.CrashCashOut) {
        this._cashOut = data;
    }

    get cashOut(): GameCrashServiceMessage.CrashCashOut {
        return this._cashOut;
    }

    set halfCashOut(data: GameCrashServiceMessage.CrashCashOut) {
        this._halfCashOut = data;
    }

    get halfCashOut(): GameCrashServiceMessage.CrashCashOut {
        return this._halfCashOut;
    }

    setCashOutNotice(cashOut) {
        this.cashOutNotice = {
            win: cashOut.win,
            cashOutWin: cashOut.cashOutWin,
            reachMaxWin: cashOut.reachMaxWin,
        };
    }
}
