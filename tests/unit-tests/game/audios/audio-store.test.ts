import { AudioAction, AudioStore, MusicState, SFXState } from "./../../../../src/game/audios/audio-store";

describe("AudioStore", () => {
    let audioStore: AudioStore;

    beforeEach(() => {
        audioStore = new AudioStore();
    });

    it("should initialize musicIds as an empty array", () => {
        expect(audioStore.musicIds).toEqual([]);
    });

    it("should initialize musicState to MusicState.NONE", () => {
        expect(audioStore.musicState).toBe(MusicState.NONE);
    });

    it("should set and get sfxState correctly", () => {
        const sfxState = { id: "example", state: SFXState.STARTED };
        audioStore.sfxState = sfxState;
        expect(audioStore.sfxState).toEqual(sfxState);
    });

    it("should set and get musicState correctly", () => {
        const musicState = MusicState.STARTED;
        audioStore.musicState = musicState;
        expect(audioStore.musicState).toBe(musicState);
    });

    it("should set and get music correctly", () => {
        const music = {
            id: "test",
            action: AudioAction.PLAY,
        };
        audioStore.music = music;
        expect(audioStore.music).toEqual(music);
    });

    it("should set and get sfx correctly", () => {
        const sfx = {
            id: "test",
            action: AudioAction.PLAY,
        };
        audioStore.sfx = sfx;
        expect(audioStore.sfx).toEqual(sfx);
    });

    it("should initialize startMusicPlayer as false", () => {
        expect(audioStore.startMusicPlayer).toBe(false);
    });

    it("should set and get startMusicPlayer correctly", () => {
        audioStore.startMusicPlayer = true;
        expect(audioStore.startMusicPlayer).toBe(true);
    });
});
