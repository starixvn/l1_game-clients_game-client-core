import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class CrashCashOutStore {
    get isFullCashedOut() {
        return this.cashOut !== null;
    }
    get isHalfCashedOut() {
        return this.halfCashOut !== null;
    }
    ratio = 1;

    cashOutNotice: {
        win: number;
        cashOutWin: number;
        reachMaxWin: boolean;
    } = null;

    private _cashOut: GameCrashServiceMessage.CrashCashOut = null;
    private _halfCashOut: GameCrashServiceMessage.CrashCashOut = null;
    private _fullCashOutValue = 0;
    private _halfCashOutValue = 0;

    constructor() {
        makeAutoObservable(this);
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

    setCashOutNotice(cashOut: GameCrashServiceMessage.CrashCashOut) {
        this.cashOutNotice = {
            win: cashOut.win,
            cashOutWin: cashOut.cashOutWin,
            reachMaxWin: cashOut.reachMaxWin,
        };
    }

    set fullCashOutValue(value: number) {
        this._fullCashOutValue = value;
    }
    get fullCashOutValue(): number {
        return this._fullCashOutValue;
    }

    set halfCashOutValue(value: number) {
        this._halfCashOutValue = value;
    }
    get halfCashOutValue(): number {
        return this._halfCashOutValue;
    }
}
