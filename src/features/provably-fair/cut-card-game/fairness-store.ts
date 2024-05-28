import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

@injectable()
export class FairnessStore {
    constructor() {
        makeAutoObservable(this);
    }

    _clientSeed = "";

    _minCS = 0;
    _maxCS = 0;

    private randomClientSeedValue(): string {
        return _.random(this._minCS, this._maxCS).toString();
    }

    get clientSeed() {
        if (this._clientSeed === "") {
            this._clientSeed = this.randomClientSeedValue();
        }
        return this._clientSeed;
    }

    set clientSeed(clientSeed: string) {
        this._clientSeed = clientSeed;
    }

    set minClientSeed(min: number) {
        this._minCS = min;
    }

    set maxClientSeed(max: number) {
        this._maxCS = max;
    }
}
