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
    private TIME_BEFORE_CUT_CARD = 48;

    get cutCardInfo() {
        return this._cutCardInfo;
    }

    set cutCardInfo(cutCardInfo: CutCardInfo) {
        this._cutCardInfo = cutCardInfo;
    }

    get showNoticeCutCardMessage() {
        return this.cutCardInfo && !this.cutCardInfo.successful && this.roundTimeStore.roundTime < this.TIME_BEFORE_CUT_CARD;
    }
}
