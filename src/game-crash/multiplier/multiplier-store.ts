import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class MultiplierStore {
    multiplier = 0;
    time = 0;

    private _isCrashed: boolean = false;

    get isCrashed(): boolean {
        return this._isCrashed;
    }

    set isCrashed(value: boolean) {
        this._isCrashed = value;
    }

    constructor() {
        makeAutoObservable(this);
    }
}
