import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
export enum AudioType {
    MUSIC = 0,
    SFX,
}

export enum AudioAction {
    STOP = 0,
    PLAY,
}

export enum MusicState {
    NONE = -1,
    STARTED = 0,
    ENDED,
}

export interface AudioData {
    id: string;
    action: AudioAction;
}

@injectable()
export class AudioStore {
    constructor() {
        makeAutoObservable(this);
    }

    musicIds: string[] = [];
    musicState = MusicState.NONE;
    music: AudioData = null;
    sfx: AudioData = null;
    startMusicPlayer = false;
}
