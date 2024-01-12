import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { RocketState } from "../game-crash-messages";

@injectable()
export class MultiplierStore {
    multiplier = 0;
    time = 0;

    private _rocketState: string = RocketState.ONLAND;

    get rocketState(): string {
        return this._rocketState;
    }

    set rocketState(value: string) {
        this._rocketState = value;
    }

    constructor() {
        makeAutoObservable(this);
    }
}
