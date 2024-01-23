import { stub } from "jest-auto-stub";
import { BetResponseHandlers, BetStore } from "../../../../src/game/bets";
import { ConnectionHandlers } from "../../../../src/game/connection";
import { RoundTimeStore } from "../../../../src/game/rounds";

describe("BetResponseHandler", () => {
    let betStore: BetStore;
    let instance: BetResponseHandlers;
    let roundTimeStore: RoundTimeStore;
    let retryGameHandler: ConnectionHandlers.RetryGameHandler;
    beforeAll(() => {
        betStore = stub<BetStore>();
        roundTimeStore = stub<RoundTimeStore>();
        retryGameHandler = stub<ConnectionHandlers.RetryGameHandler>();
        instance = new BetResponseHandlers(betStore, roundTimeStore, retryGameHandler);
        betStore.isProcessingBet = true;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleBetResponse", () => {
        beforeEach(() => {
            betStore.isProcessingBet = true;
            betStore.lastReceivedBet = { value: 0, isAnimated: false };
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
            expect(betStore.lastReceivedBet).toEqual({ value: endBet, isAnimated: true });
        });
    });
});
