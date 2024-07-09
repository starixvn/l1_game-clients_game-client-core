import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { RoundStore, RoundTimeStore } from "../../game/rounds";
import { GameServiceMessage } from "../../shared";

@injectable()
export class ShoeStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
    ) {
        makeAutoObservable(this);
    }

    _newShoeHash: GameServiceMessage.NewShoeHash = null;
    _shoeInfo: GameServiceMessage.ShoeInfo = null;
    shoeHash = "";
    newShoePhase = false;

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
