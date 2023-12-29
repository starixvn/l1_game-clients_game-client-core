import { stub } from "jest-auto-stub";

import { AutoCashOutPopupHandler } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-popup-handler";
import { AutoCashOutPopupStore } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-popup-store";
import { CrashGameConfigStore } from "../../../../src/game-crash/game-configs/crash-game-config-store";

describe("AutoCashOutPopupHandler", () => {
    let autoCashOutPopupHandler: AutoCashOutPopupHandler;
    let autoCashoutPopupStore: AutoCashOutPopupStore;
    let gameConfigStore: CrashGameConfigStore;

    beforeEach(() => {
        gameConfigStore = stub<CrashGameConfigStore>({ maxMultiplier: 20 });
        autoCashoutPopupStore = new AutoCashOutPopupStore();
        autoCashOutPopupHandler = new AutoCashOutPopupHandler(autoCashoutPopupStore, gameConfigStore);
    });

    describe("togglePopup", () => {
        it("should update enable for autoCashoutPopupStore", async () => {
            // Arrange

            // Act
            autoCashOutPopupHandler.togglePopup(true);

            // Assert
            expect(autoCashoutPopupStore.enable).toEqual(true);
        });
    });

    describe("handleMultiplier", () => {
        it("should update multiplier for autoCashoutPopupStore", async () => {
            // Arrange
            const multiplierString = "2.00";
            // Act
            autoCashOutPopupHandler.handleMultiplier(multiplierString);

            // Assert
            expect(autoCashoutPopupStore.multiplier).toEqual(multiplierString);
        });

        describe("when 1.01 < multiplier < maxMultiplier", () => {
            it("should update isValid is true for autoCashoutPopupStore", async () => {
                // Arrange
                const multiplierString = "2.00";

                // Act
                autoCashOutPopupHandler.handleMultiplier(multiplierString);

                // Assert
                expect(autoCashoutPopupStore.isValid).toEqual(true);
            });
        });

        describe("when multiplier < 1.01", () => {
            it("should update isValid is false for autoCashoutPopupStore", async () => {
                // Arrange
                const multiplierString = "1.00";

                // Act
                autoCashOutPopupHandler.handleMultiplier(multiplierString);

                // Assert
                expect(autoCashoutPopupStore.isValid).toEqual(false);
            });
        });
    });
});
