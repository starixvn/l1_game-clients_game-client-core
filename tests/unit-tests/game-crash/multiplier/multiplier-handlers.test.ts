import { stub } from "jest-auto-stub";

import { MultiplierHandlers } from "../../../../src/game-crash/multiplier/multiplier-handlers";
import { MultiplierStore } from "../../../../src/game-crash/multiplier/multiplier-store";

describe("MultiplierHandlers", () => {
    let multiplierHandlers: MultiplierHandlers;
    let multiplierStore: MultiplierStore;

    beforeAll(() => {
        multiplierStore = stub<MultiplierStore>();
    });

    beforeEach(() => {
        multiplierHandlers = new MultiplierHandlers(multiplierStore);
    });

    describe("handle", () => {
        const multiplierInfo = { m: 1, t: 2000 };

        it("should update multiplier", async () => {
            // Arrange

            // Act
            multiplierHandlers.handle(multiplierInfo);

            // Assert
            expect(multiplierHandlers["multiplierStore"].multiplier).toEqual(multiplierInfo.m);
        });

        it("should update time", async () => {
            // Arrange

            // Act
            multiplierHandlers.handle(multiplierInfo);

            // Assert
            expect(multiplierHandlers["multiplierStore"].time).toEqual(multiplierInfo.t);
        });
    });

    describe("handleMultiplierCrashed", () => {
        it("should update multiplier", async () => {
            // Arrange
            const multiplier = 10;

            // Act
            multiplierHandlers.handleMultiplierCrashed(multiplier);

            // Assert
            expect(multiplierHandlers["multiplierStore"].multiplier).toEqual(multiplier);
        });
    });

    describe("handleIsCrashed", () => {
        it("should update isCrashed", async () => {
            // Arrange
            const isCrashed = true;

            // Act
            multiplierHandlers.handleIsCrashed(isCrashed);

            // Assert
            expect(multiplierHandlers["multiplierStore"].isCrashed).toEqual(isCrashed);
        });
    });
});
