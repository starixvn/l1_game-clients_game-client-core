import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

interface CutCardInfo {
    cutCardIndex: number;
    successful: boolean;
}
@injectable()
export class CutCardStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _cutCardInfo: CutCardInfo = null;

    get cutCardInfo() {
        return this._cutCardInfo;
    }

    set cutCardInfo(cutCardInfo: CutCardInfo) {
        this._cutCardInfo = cutCardInfo;
    }
}
