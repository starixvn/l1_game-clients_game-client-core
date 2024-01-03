import { stub } from "jest-auto-stub";

import { CrashGameConfigHandlers } from "../../../../src/game-crash/game-configs/crash-game-config-handlers";
import { CrashGameConfigStore } from "../../../../src/game-crash/game-configs/crash-game-config-store";

describe("CrashGameConfigHandlers", () => {
    let gameConfigHandlers: CrashGameConfigHandlers;
    let gameConfigStore: CrashGameConfigStore;

    beforeAll(() => {
        gameConfigStore = stub<CrashGameConfigStore>();
    });

    beforeEach(() => {
        gameConfigHandlers = new CrashGameConfigHandlers(gameConfigStore);
    });

    describe("handleGameConfigs", () => {
        it("should update maxMultiplier", async () => {
            // Arrange
            const gameConfig = { maxMultiplier: 2000 };

            // Act
            gameConfigHandlers.handleGameConfigs(gameConfig);

            // Assert
            expect(gameConfigStore.maxMultiplier).toEqual(gameConfig.maxMultiplier);
        });
    });
});
