import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { HideGameGameStore } from "../hide-game";
import { UserSettingStore } from "../user-settings";
import { AudioAction, AudioStore, MusicState } from "./audio-store";
@injectable()
export class AudioHandler {
    constructor(
        @inject(AudioStore) private readonly audioStore: AudioStore,
        @inject(UserSettingStore) protected readonly userSettingsStore: UserSettingStore,
        @inject(HideGameGameStore) protected readonly hideGameGameStore: HideGameGameStore
    ) {}

    playMusic(audioId: string) {
        if (this.userSettingsStore.musicEnable && !this.hideGameGameStore.isHideGame) {
            this.audioStore.music = { id: audioId, action: AudioAction.PLAY };
        }
    }

    stopMusic(audioId: string) {
        this.audioStore.music = { id: audioId, action: AudioAction.STOP };
    }

    playSFX(audioId: string) {
        if (this.userSettingsStore.sfxEnable && !this.hideGameGameStore.isHideGame) {
            this.audioStore.sfx = { id: audioId, action: AudioAction.PLAY };
        }
    }

    stopSFX(audioId: string) {
        this.audioStore.sfx = { id: audioId, action: AudioAction.STOP };
    }

    playStoppableSFX(audioId: string) {
        if (this.userSettingsStore.sfxEnable) {
            this.audioStore.stoppableSFX = { id: audioId, action: AudioAction.PLAY };
        }
    }

    stopStoppableSFX(audioId: string) {
        this.audioStore.stoppableSFX = { id: audioId, action: AudioAction.STOP };
    }

    updateMusicState(state: MusicState) {
        this.audioStore.musicState = state;
    }

    setMusicIds(ids: string[]) {
        this.audioStore.musicIds = [...ids];
    }

    setMusicGameIds(ids: string[]) {
        this.audioStore.musicGameIds = [...ids];
    }

    playRandomMusic() {
        const musicIds = this.audioStore.musicIds;
        const musicGameIds = this.audioStore.musicGameIds;

        const musicTmp = musicGameIds.length > 0 ? musicGameIds : musicIds;

        if (musicTmp.length === 0) {
            return;
        }

        this.playMusic(_.sample(musicTmp));
    }

    audiosLoaded() {
        this.audioStore.startMusicPlayer = this.userSettingsStore.musicEnable;
    }
}
