import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashGameConfigStore {
    private readonly _minMultiplier = 1.01;
    private _maxMultiplier = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get maxMultiplier() {
        return this._maxMultiplier;
    }

    set maxMultiplier(maxMultiplier: number) {
        this._maxMultiplier = maxMultiplier;
    }

    get minMultiplier() {
        return this._minMultiplier;
    }
}
