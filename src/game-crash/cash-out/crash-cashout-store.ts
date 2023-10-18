import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashCashoutStore {
    cashoutAmount = 0;
    cashoutHalfAmount = 0;
    isCashedOutFull = false;
    isCashedOutHalf = false;

    constructor() {
        makeAutoObservable(this);
    }

    get showCashoutNotice() {
        return this.isCashedOutFull || this.isCashedOutHalf;
    }
}
