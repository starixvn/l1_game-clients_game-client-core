import { injectable } from "inversify";

import { makeAutoObservable } from "mobx";

@injectable()
export class FairnessStore {
    constructor() {
        makeAutoObservable(this);
    }

    _clientSeed = "";

    _minCS = 0;
    _maxCS = 0;

    get clientSeed() {
        return this._clientSeed;
    }

    set clientSeed(clientSeed: string) {
        this._clientSeed = clientSeed;
    }

    set minClientSeed(min: number) {
        this._minCS = min;
    }

    get minClientSeed() {
        return this._minCS;
    }

    set maxClientSeed(max: number) {
        this._maxCS = max;
    }

    get maxClientSeed() {
        return this._maxCS;
    }
}
