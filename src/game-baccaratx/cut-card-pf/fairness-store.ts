import { OpenVerification } from "./definitions";

import { injectable } from "inversify";

import { makeAutoObservable } from "mobx";

interface CutCardInfo {
    cutCardIndex: number;
    successful: boolean;
}

@injectable()
export class FairnessStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _isShowFairnessSettingsPopup = false;
    private _dontShowAgain = false;

    private _clientSeed = "";

    private _minCS = 0;
    private _maxCS = 0;
    openVerification: OpenVerification = null;
    openCutCardIndex: OpenVerification = null;
    private _cutCardInfo: CutCardInfo = null;
    showWaitingScreen = false;
    showNoticeCutCardFailed = false;

    get clientSeed() {
        return this._clientSeed;
    }

    set clientSeed(clientSeed: string) {
        this._clientSeed = clientSeed;
    }

    set minClientSeed(min: number) {
        this._minCS = min;
    }

    get minClientSeed() {
        return this._minCS;
    }

    set maxClientSeed(max: number) {
        this._maxCS = max;
    }

    get maxClientSeed() {
        return this._maxCS;
    }

    get isShowFairnessSettingsPopup() {
        return this._isShowFairnessSettingsPopup;
    }

    set isShowFairnessSettingsPopup(isShow: boolean) {
        this._isShowFairnessSettingsPopup = isShow;
    }

    get dontShowAgain() {
        return this._dontShowAgain;
    }

    set dontShowAgain(isShow: boolean) {
        this._dontShowAgain = isShow;
    }

    get cutCardInfo() {
        return this._cutCardInfo;
    }

    set cutCardInfo(cutCardInfo: CutCardInfo) {
        this._cutCardInfo = cutCardInfo;
    }
}
