import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface ExtraFeeInfo {
    fee: number;
    isRatio: boolean;
}

@injectable()
export class ExtraFeeStore {
    private _extraFee: ExtraFeeInfo = null;
    constructor() {
        makeAutoObservable(this);
    }

    get extraFee() {
        return this._extraFee;
    }

    set extraFee(extraFee: ExtraFeeInfo) {
        this._extraFee = extraFee;
    }
}
