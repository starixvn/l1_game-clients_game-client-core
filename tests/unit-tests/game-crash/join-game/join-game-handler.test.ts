import { stub } from "jest-auto-stub";

import { AppStore } from "../../../../src/app/app-store";
import { AutoCashOutStore } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-store";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { JoinGameCrashHandler } from "../../../../src/game-crash/join-game/join-game-handler";
import { StorageManager } from "./../../../../src/shared/utils/storage-manager";

describe("JoinGameCrashHandler", () => {
    let gameConfigHandlers: JoinGameCrashHandler;
    let betInputStore: BetInputStore;
    let autoCashOutStore: AutoCashOutStore;
    let appStore: AppStore;

    beforeAll(() => {
        betInputStore = stub<BetInputStore>({ initBetAmount: jest.fn() });
        autoCashOutStore = stub<AutoCashOutStore>({ loadMultiplierFromStorage: jest.fn() });
        appStore = stub<AppStore>();
    });

    beforeEach(() => {
        gameConfigHandlers = new JoinGameCrashHandler(betInputStore, autoCashOutStore, appStore);
    });

    describe("handleGameConfigs", () => {
        it("should call remove() of StorageManager", async () => {
            // Arrange
            const removeSpy = jest.spyOn(StorageManager, "remove").mockImplementation(jest.fn());

            // Act
            gameConfigHandlers.handle();

            // Assert
            expect(removeSpy).toBeCalled();
        });

        it("should call initBetAmount() of BetInputStore", async () => {
            // Arrange

            // Act
            gameConfigHandlers.handle();

            // Assert
            expect(gameConfigHandlers["betInputStore"].initBetAmount).toBeCalled();
        });

        it("should call loadMultiplierFromStorage() of AutoCashOutStore", async () => {
            // Arrange

            // Act
            gameConfigHandlers.handle();

            // Assert
            expect(gameConfigHandlers["autoCashOutStore"].loadMultiplierFromStorage).toBeCalled();
        });
    });
});
