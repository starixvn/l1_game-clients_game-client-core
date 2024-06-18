import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
@injectable()
export class HideGameGameStore {
    private _isHideGame = false;

    constructor() {
        makeAutoObservable(this);
    }

    public get isHideGame(): boolean {
        return this._isHideGame;
    }

    public set isHideGame(status: boolean) {
        this._isHideGame = status;
    }
}
