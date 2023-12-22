import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class PopupsGameStore {
    private _enabledOverlay = false;
    constructor() {
        makeAutoObservable(this);
    }

    get enabledOverlay(): boolean {
        return this._enabledOverlay;
    }

    set enabledOverlay(value: boolean) {
        this._enabledOverlay = value;
    }
}
