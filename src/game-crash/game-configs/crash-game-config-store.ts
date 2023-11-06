import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class CrashGameConfigStore {
    private _maxMultiplier: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get maxMultiplier() {
        return this._maxMultiplier;
    }

    set maxMultiplier(maxMultiplier: number) {
        this._maxMultiplier = maxMultiplier;
    }
}
