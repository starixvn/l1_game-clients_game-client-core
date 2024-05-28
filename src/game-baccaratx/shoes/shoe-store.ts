import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

interface CutCardInfo {
    cutCardIndex: number;
    isSuccessful: boolean;
}

interface ShoeInfo {
    cutCardIndex: number;
    burnCards: number;
    firstCard: number;
}

@injectable()
export class ShoeStore {
    constructor() {
        makeAutoObservable(this);
    }

    _newShoeHash: GameServiceMessage.NewShoeHash = null;
    _shoeInfo: GameServiceMessage.ShoeInfo = null;

    get newShoeHash() {
        return this._newShoeHash;
    }

    set newShoeHash(newShoeHash: GameServiceMessage.NewShoeHash) {
        this._newShoeHash = newShoeHash;
    }

    get shoeInfo() {
        return this._shoeInfo;
    }

    set shoeInfo(shoeInfo: GameServiceMessage.ShoeInfo) {
        this._shoeInfo = shoeInfo;
    }
}
