import { BetStore } from "./../../../../src/game/bets/bet-store";

describe("BetStore test", () => {
    beforeEach(() => {});

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("init default values", () => {
        it("amount equal 1", () => {
            // Arrange

            // Act
            const betStore = new BetStore();

            // Assert
            expect(betStore.amount).toEqual(1);
        });
        it("freebetEnabled equal false", () => {
            // Arrange

            // Act
            const betStore = new BetStore();

            // Assert
            expect(betStore.freebetEnabled).toEqual(false);
        });
    });
});
