import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { StorageManager, localStorageKeys } from "../../shared/utils";

@injectable()
export class AudioStore {
    readonly soundObservers = { music: {}, sfx: {} };
    private _isPlay = false;
    private _sfxEnabled = false;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        this.sfxMusic();
    }

    private sfxMusic() {
        const sfx = StorageManager.get(localStorageKeys.audioClip);
        if (sfx === "") {
            this._sfxEnabled = true;
        }
    }

    get sfxEnabled(): boolean {
        const check = StorageManager.get(localStorageKeys.audioClip);
        return check ? check === "true" : this._sfxEnabled;
    }

    set sfxEnabled(value: boolean) {
        StorageManager.set(localStorageKeys.audioClip, value.toString());
        this._sfxEnabled = value;
    }

    get isPlay() {
        return this._isPlay;
    }

    set isPlay(value: boolean) {
        this._isPlay = value;
    }
}
