import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { RoundTimeStore } from "../../../game/rounds";

interface CutCardInfo {
    cutCardIndex: number;
    successful: boolean;
}
@injectable()
export class CutCardStore {
    constructor(@inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore) {
        makeAutoObservable(this);
    }

    private _cutCardInfo: CutCardInfo = null;
    showNoticeCutCardFailed = false;

    get cutCardInfo() {
        return this._cutCardInfo;
    }

    set cutCardInfo(cutCardInfo: CutCardInfo) {
        this._cutCardInfo = cutCardInfo;
    }
}
