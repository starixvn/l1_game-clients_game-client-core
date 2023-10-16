import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashCashoutStore {
    cashoutAmount = 0;

    constructor() {
        makeAutoObservable(this);
    }
}
