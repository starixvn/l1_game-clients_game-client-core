import { stub } from "jest-auto-stub";

import { AutoCashOutPopupHandler } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-popup-handler";
import { AutoCashOutPopupStore } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-popup-store";
import { CrashGameConfigStore } from "../../../../src/game-crash/game-configs/crash-game-config-store";

describe("AutoCashOutPopupHandler", () => {
    let autoCashOutPopupHandler: AutoCashOutPopupHandler;
    let autoCashOutPopupStore: AutoCashOutPopupStore;
    let gameConfigStore: CrashGameConfigStore;
    beforeAll(() => {
        gameConfigStore = stub<CrashGameConfigStore>({ minMultiplier: 1.01, maxMultiplier: 20 });
        autoCashOutPopupStore = new AutoCashOutPopupStore();
    });

    beforeEach(() => {
        autoCashOutPopupHandler = new AutoCashOutPopupHandler(autoCashOutPopupStore, gameConfigStore);
    });

    describe("togglePopup", () => {
        it("should update enable for autoCashOutPopupStore", async () => {
            // Arrange

            // Act
            autoCashOutPopupHandler.togglePopup(true);

            // Assert
            expect(autoCashOutPopupStore.enable).toEqual(true);
        });
    });

    describe("handleMultiplier", () => {
        const multiplier = "2.00";

        it("should update multiplier for autoCashOutPopupStore", async () => {
            // Arrange

            // Act
            autoCashOutPopupHandler.handleMultiplier(multiplier);

            // Assert
            expect(autoCashOutPopupStore.multiplier).toEqual(multiplier);
        });

        it("should call isValidMultiplier()", async () => {
            // Arrange
            autoCashOutPopupHandler["isValidMultiplier"] = jest.fn();

            // Act
            autoCashOutPopupHandler.handleMultiplier(multiplier);

            // Assert
            expect(autoCashOutPopupHandler["isValidMultiplier"]).toBeCalled();
        });
    });

    describe("isValidMultiplier", () => {
        describe("when multiplier is greater than minBet and multiplier less than maxBet", () => {
            it("should return true", async () => {
                // Arrange
                const multiplier = "2.00";

                // Act
                autoCashOutPopupHandler["isValidMultiplier"](multiplier);

                // Assert
                expect(autoCashOutPopupHandler["isValidMultiplier"](multiplier)).toEqual(true);
            });
        });

        describe("when multiplier greater than maxBet", () => {
            it("should return false", async () => {
                // Arrange
                const multiplier = "30.00";

                // Act
                autoCashOutPopupHandler["isValidMultiplier"](multiplier);

                // Assert
                expect(autoCashOutPopupHandler["isValidMultiplier"](multiplier)).toEqual(false);
            });
        });

        describe("when multiplier less than minBet", () => {
            it("should return false", async () => {
                // Arrange
                const multiplier = "1.00";

                // Act
                autoCashOutPopupHandler["isValidMultiplier"](multiplier);

                // Assert
                expect(autoCashOutPopupHandler["isValidMultiplier"](multiplier)).toEqual(false);
            });
        });

        describe("when multiplier is equal to minBet", () => {
            it("should return false", async () => {
                // Arrange
                const multiplier = "1.01";

                // Act
                autoCashOutPopupHandler["isValidMultiplier"](multiplier);

                // Assert
                expect(autoCashOutPopupHandler["isValidMultiplier"](multiplier)).toEqual(true);
            });
        });

        describe("when multiplier is equal to maxBet", () => {
            it("should return false", async () => {
                // Arrange
                const multiplier = "20.00";

                // Act
                autoCashOutPopupHandler["isValidMultiplier"](multiplier);

                // Assert
                expect(autoCashOutPopupHandler["isValidMultiplier"](multiplier)).toEqual(true);
            });
        });
    });
});
