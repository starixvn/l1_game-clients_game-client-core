import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { UserSettingStore } from "../user-settings";
import { AudioAction, AudioStore, ISFXState, MusicState } from "./audio-store";
@injectable()
export class AudioHandler {
    constructor(
        @inject(AudioStore) private readonly audioStore: AudioStore,
        @inject(UserSettingStore) protected readonly userSettingsStore: UserSettingStore
    ) {}

    playMusic(audioId: string) {
        if (this.userSettingsStore.musicEnable) {
            this.audioStore.music = { id: audioId, action: AudioAction.PLAY };
        }
    }

    stopMusic(audioId: string) {
        this.audioStore.music = { id: audioId, action: AudioAction.STOP };
    }

    playSFX(audioId: string) {
        if (this.userSettingsStore.sfxEnable) {
            this.audioStore.sfx = { id: audioId, action: AudioAction.PLAY };
        }
    }

    stopSFX(audioId: string) {
        this.audioStore.sfx = { id: audioId, action: AudioAction.STOP };
    }

    updateMusicState(state: MusicState) {
        this.audioStore.musicState = state;
    }

    setMusicIds(ids: string[]) {
        this.audioStore.musicIds = [...ids];
    }

    playRandomMusic() {
        const musicIds = this.audioStore.musicIds;
        if (!musicIds.length) {
            return;
        }
        const id = musicIds.length === 1 ? musicIds[0] : musicIds[_.random(musicIds.length - 1)];
        this.playMusic(id);
    }

    audiosLoaded() {
        this.audioStore.startMusicPlayer = this.userSettingsStore.musicEnable;
    }

    updateSFXState(sfxState: ISFXState) {
        this.audioStore.sfxState = sfxState;
    }
}
