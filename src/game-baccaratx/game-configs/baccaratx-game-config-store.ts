import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class BaccaratXGameConfigStore {
    private _extraFeeRatio = 0;
    constructor() {
        makeAutoObservable(this);
    }

    get extraFeeRatio() {
        return this._extraFeeRatio;
    }

    set extraFeeRatio(extraFeeRatio: number) {
        this._extraFeeRatio = extraFeeRatio;
    }
}
