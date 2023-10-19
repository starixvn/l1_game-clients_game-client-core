import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashCashoutStore {
    cashoutAmount = 0;
    cashoutHalfAmount = 0;
    isCashedOutFull = false;
    isCashedOutHalf = false;
    ratio = 1;

    cashOutNotice: {
        value: number;
    } = null;

    constructor() {
        makeAutoObservable(this);
    }
}
