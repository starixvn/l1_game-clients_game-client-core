import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

interface CutCardInfo {
    cutCardIndex: number;
    successful: boolean;
}

@injectable()
export class FairnessStore {
    constructor() {
        makeAutoObservable(this);
    }

    _clientSeed = "";
    _cutCardInfo: CutCardInfo = null;

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

    get cutCardInfo() {
        return this._cutCardInfo;
    }

    set cutCardInfo(cutCardInfo: CutCardInfo) {
        this._cutCardInfo = cutCardInfo;
    }
}
