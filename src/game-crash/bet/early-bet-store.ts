import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { PlayerActionStore } from "../player-actions";

@injectable()
export class EarlyBetStore {
    private _earlyBetEnable = false;

    set earlyBetEnable(value: boolean) {
        this._earlyBetEnable = value;
    }
    get earlyBetEnable(): boolean {
        return this._earlyBetEnable;
    }

    constructor(@inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore) {
        makeAutoObservable(this);
    }
}
