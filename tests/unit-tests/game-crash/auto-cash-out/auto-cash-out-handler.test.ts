import { stub } from "jest-auto-stub";

import { AutoCashOutHandler } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-handler";
import { AutoCashOutStore } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-store";
import { RoundStore } from "../../../../src/game/rounds/round-store";

describe("AutoCashOutHandler", () => {
    let autoCashOutHandler: AutoCashOutHandler;
    let autoCashOutStore: AutoCashOutStore;
    let roundStore: RoundStore;

    beforeEach(() => {
        roundStore = stub<RoundStore>();
        autoCashOutStore = new AutoCashOutStore(roundStore);
        autoCashOutHandler = new AutoCashOutHandler(autoCashOutStore);
    });

    describe("handleEnable", () => {
        it("should update enable for autoCashoutStore", async () => {
            // Arrange

            // Act
            autoCashOutHandler.handleEnable(true);

            // Assert
            expect(autoCashOutStore.enable).toEqual(true);
        });
    });

    describe("handleMultiplier", () => {
        it("should update multiplier for autoCashoutStore", async () => {
            // Arrange
            const multiplier = 2;

            // Act
            autoCashOutHandler.handleMultiplier(multiplier);

            // Assert
            expect(autoCashOutStore.multiplier).toEqual(multiplier);
        });
    });

    describe("adjustMultiplier", () => {
        it("should update multiplier for autoCashoutStore", async () => {
            // Arrange
            const adjustValue = 1;
            autoCashOutStore.multiplier = 1;

            // Act
            autoCashOutHandler.adjustMultiplier(adjustValue);

            // Assert
            expect(autoCashOutStore.multiplier).toEqual(2);
        });
    });

    describe("handleDisableAuto", () => {
        it("should update disable status for autoCashoutStore", async () => {
            // Arrange

            // Act
            autoCashOutHandler.handleDisableAuto(true);

            // Assert
            expect(autoCashOutStore.disable).toEqual(true);
        });
    });
});
