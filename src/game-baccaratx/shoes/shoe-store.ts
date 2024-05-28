import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

interface CutCardInfo {
    cutCardIndex: number;
    isSuccessful: boolean;
}

@injectable()
export class ShoeStore {
    constructor() {
        makeAutoObservable(this);
    }

    _newShoeHash: GameServiceMessage.NewShoeHash = null;

    get newShoeHash() {
        return this._newShoeHash;
    }

    set newShoeHash(newShoeHash: GameServiceMessage.NewShoeHash) {
        this._newShoeHash = newShoeHash;
    }
}
