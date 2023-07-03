import { stub } from "jest-auto-stub";
import { AudioType } from "../../../../src/game/audios";
import { UserSettingHandlers } from "../../../../src/game/user-settings/user-setting-handlers";
import { UserSettingStore } from "../../../../src/game/user-settings/user-setting-store";
import { StorageManager, localStorageKeys } from "../../../../src/shared/utils";
describe("UserSettingHandlers", () => {
    let userSettingHandlers: UserSettingHandlers;
    let userSettingStore: UserSettingStore;

    beforeAll(() => {
        userSettingStore = new UserSettingStore();
        userSettingHandlers = new UserSettingHandlers(userSettingStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("loadStorages", () => {
        it("should load storages successfully", () => {
            // Arrange
            const settingsData = {
                _musicEnable: true,
                _sfxEnable: false,
            };
            StorageManager.get = jest.fn().mockReturnValue(settingsData);

            // Act
            userSettingHandlers.loadStorages();

            // Assert
            expect(StorageManager.get).toHaveBeenCalledWith(localStorageKeys.playerSetting);
            expect(userSettingStore).toEqual(settingsData);
        });

        it("should not load storages if there are no settings available", () => {
            // Arrange
            const defaultStore = stub<UserSettingStore>({ _musicEnable: false, _sfxEnable: true });
            userSettingStore = defaultStore;
            StorageManager.get = jest.fn().mockReturnValue(undefined);

            // Act
            userSettingHandlers.loadStorages();

            // Assert
            expect(userSettingStore.musicEnable).toEqual(defaultStore.musicEnable);
            expect(userSettingStore.sfxEnable).toEqual(defaultStore.sfxEnable);
        });
    });

    describe("saveStorages", () => {
        it("should save storages successfully", () => {
            // Arrange
            const settingsData = {
                musicEnable: true,
                sfxEnable: false,
            };

            userSettingStore = stub<UserSettingStore>(settingsData);
            StorageManager.set = jest.fn();

            // Act
            userSettingHandlers.saveStorages();

            // Assert
            expect(StorageManager.set).toHaveBeenCalledWith(localStorageKeys.playerSetting, userSettingStore);
        });
    });

    describe("setMusicEnable", () => {
        it("should set music enable successfully", () => {
            // Arrange
            const saveStoragesMock = jest.spyOn(userSettingHandlers, "saveStorages");

            // Act
            userSettingHandlers.setMusicEnable(true);

            // Assert
            expect(userSettingStore.musicEnable).toEqual(true);
            expect(saveStoragesMock).toHaveBeenCalled();
        });
    });

    describe("setSfxEnable", () => {
        it("should set sfx enable successfully", () => {
            // Arrange
            const saveStoragesMock = jest.spyOn(userSettingHandlers, "saveStorages");

            // Act
            userSettingHandlers.setSfxEnable(false);

            // Assert
            expect(userSettingStore.sfxEnable).toEqual(false);
            expect(saveStoragesMock).toHaveBeenCalled();
        });
    });

    describe("handleAudioChanged", () => {
        it("should handle audio change for music type", () => {
            // Arrange
            const setMusicEnableMock = jest.spyOn(userSettingHandlers, "setMusicEnable");

            // Act
            userSettingHandlers.handleAudioChanged(AudioType.MUSIC, true);

            // Assert
            expect(setMusicEnableMock).toHaveBeenCalledWith(true);
        });

        it("should handle audio change for sfx type", () => {
            // Arrange
            const setSfxEnableMock = jest.spyOn(userSettingHandlers, "setSfxEnable");

            // Act
            userSettingHandlers.handleAudioChanged(AudioType.SFX, true);

            // Assert
            expect(setSfxEnableMock).toHaveBeenCalledWith(true);
        });
    });
});
