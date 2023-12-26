import { stub } from "jest-auto-stub";
import { AutoCashOutStore } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-store";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { HideGameCrashHandler } from "../../../../src/game-crash/hide-game";
import { ConnectionStore } from "../../../../src/game/connection/connection-store";
import { GameSetting } from "../../../../src/game/game-configs";
import { RoundRunningHandlers, RoundTimeStore } from "../../../../src/game/rounds";
import { StorageManager, localStorageKeys } from "../../../../src/shared/utils/storage-manager";
import { gameSettings } from "../../container.test";
import { IGameCrashUserSettings } from "./../../../../src/game-crash/game-crash-messages";

describe("HideGameCrashHandler", () => {
    let hideGameCrashHandler: HideGameCrashHandler;
    let connectStore: ConnectionStore;
    let roundTimeStore: RoundTimeStore;
    let gameSetting: GameSetting;
    let betInputStore: BetInputStore;
    let autoCashOutStore: AutoCashOutStore;
    let roundRunning: RoundRunningHandlers;

    beforeEach(() => {
        gameSetting = new GameSetting();
        gameSetting.name = gameSettings.name;
        gameSetting.durations = gameSettings.durations;
        roundTimeStore = stub<RoundTimeStore>();
        connectStore = stub<ConnectionStore>();
        betInputStore = stub<BetInputStore>();
        autoCashOutStore = stub<AutoCashOutStore>();
        roundRunning = new RoundRunningHandlers(roundTimeStore, gameSetting);
        roundRunning = new RoundRunningHandlers(roundTimeStore, gameSetting);
        hideGameCrashHandler = new HideGameCrashHandler(roundRunning, connectStore, betInputStore, autoCashOutStore);
    });

    describe("handle", () => {
        it("should call super.handle and saveUserSetting if betAmount is greater than 0", async () => {
            // Arrange
            betInputStore = stub<BetInputStore>({ betAmount: 10 });
            hideGameCrashHandler = new HideGameCrashHandler(roundRunning, connectStore, betInputStore, autoCashOutStore);
            hideGameCrashHandler.saveUserSetting = jest.fn();
            const superHandleMock = jest.spyOn(HideGameCrashHandler.prototype, "handle");

            // Act
            await hideGameCrashHandler.handle();

            // Assert
            expect(superHandleMock).toHaveBeenCalled();
            expect(hideGameCrashHandler.saveUserSetting).toHaveBeenCalled();
        });

        it("should call super.handle and not saveUserSetting if betAmount is 0", async () => {
            // Arrange
            betInputStore = stub<BetInputStore>({ betAmount: 0 });
            hideGameCrashHandler = new HideGameCrashHandler(roundRunning, connectStore, betInputStore, autoCashOutStore);
            hideGameCrashHandler.saveUserSetting = jest.fn();
            const superHandleMock = jest.spyOn(HideGameCrashHandler.prototype, "handle");

            // Act
            await hideGameCrashHandler.handle();

            // Assert
            expect(superHandleMock).toHaveBeenCalled();
            expect(hideGameCrashHandler.saveUserSetting).not.toHaveBeenCalled();
        });
    });

    describe("saveUserSetting", () => {
        it("should save user settings to StorageManager", () => {
            // Arrange
            const currentSettingMock: IGameCrashUserSettings = {
                betAmount: 10,
                enableAutoCashOut: true,
                autoCashOutMultiplier: 2,
            };
            betInputStore = stub<BetInputStore>({ betAmount: currentSettingMock.betAmount });
            autoCashOutStore = stub<AutoCashOutStore>({
                enable: currentSettingMock.enableAutoCashOut,
                multiplier: currentSettingMock.autoCashOutMultiplier,
            });
            hideGameCrashHandler = new HideGameCrashHandler(roundRunning, connectStore, betInputStore, autoCashOutStore);
            StorageManager.set = jest.fn();

            // Act
            hideGameCrashHandler.saveUserSetting();

            // Assert
            expect(StorageManager.set).toHaveBeenCalledWith(localStorageKeys.userSetting, currentSettingMock);
        });
    });
});
