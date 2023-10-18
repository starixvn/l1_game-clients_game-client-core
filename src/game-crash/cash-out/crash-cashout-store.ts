import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashCashoutStore {
    cashoutAmount = 0;
    isCashedOutFull = false;
    isCashedOutHalf = false;

    constructor() {
        makeAutoObservable(this);
    }
}
