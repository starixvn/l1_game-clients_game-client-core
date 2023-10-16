import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashCashoutStore {
    multiplier = 0;
    betAmount = 0;

    constructor() {
        makeAutoObservable(this);
    }
}
