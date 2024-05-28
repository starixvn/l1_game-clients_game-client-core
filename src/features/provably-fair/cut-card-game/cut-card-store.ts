import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

@injectable()
export class CutCardStore {
    constructor() {
        makeAutoObservable(this);
    }

    _clientSeed = "";

    private randomClientSeedValue(): string {
        return _.random(300, 350).toString();
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
}
