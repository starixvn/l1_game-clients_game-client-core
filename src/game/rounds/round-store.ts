import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class RoundStore {
    constructor() {
        makeAutoObservable(this);
    }

    _roundId = 0;

    get roundId() {
        return this._roundId;
    }

    set roundId(roundId: number) {
        this._roundId = roundId;
    }
}
