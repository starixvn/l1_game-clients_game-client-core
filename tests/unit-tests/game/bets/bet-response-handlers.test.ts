import { BetResponseHandlers, BetStore } from "../../../../src/game/bets";

describe("BetResponseHandler", () => {
    let betStore: BetStore;
    let instance: BetResponseHandlers;
    beforeAll(() => {
        betStore = new BetStore();
        instance = new BetResponseHandlers(betStore);
        betStore.isProcessingBet = true;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleBetResponse", () => {
        beforeEach(() => {
            betStore.isProcessingBet = true;
            betStore.lastReceivedBet = 0;
        });

        it("set betStore.isProcessingBet false", () => {
            // Arrange
            const endBet = 10;

            // Act
            instance.handleBetResponse(endBet);

            // Assert
            expect(betStore.isProcessingBet).toEqual(false);
        });

        it("set betStore.lastReceivedBet by endBet", () => {
            // Arrange
            const endBet = 10;

            // Act
            instance.handleBetResponse(endBet);

            // Assert
            expect(betStore.lastReceivedBet).toEqual(endBet);
        });
    });
});
