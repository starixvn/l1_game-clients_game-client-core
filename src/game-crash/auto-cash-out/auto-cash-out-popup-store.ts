import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class AutoCashOutPopupStore {
    private _enable = false;
    private _isValid = false;
    private _multiplier = "0";

    constructor() {
        makeAutoObservable(this);
    }
    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }

    get isValid(): boolean {
        return this._isValid;
    }

    set isValid(isValid: boolean) {
        this._isValid = isValid;
    }

    get multiplier(): string {
        return this._multiplier;
    }

    set multiplier(multiplier: string) {
        this._multiplier = multiplier;
    }
}
