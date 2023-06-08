import { GameConfigStore } from "../../../../src/game/game-configs";
import { PlayerStore } from "../../../../src/players";
import { GameServiceMessage } from "../../../../src/shared";
import { RoundHandlers } from "./../../../../src/game/rounds/round-handlers";
import { RoundStore } from "./../../../../src/game/rounds/round-store";

describe("RoundHandlers test", () => {
    let playerStore: PlayerStore;
    let configStore: GameConfigStore;
    let roundStore: RoundStore;

    beforeEach(() => {
        playerStore = new PlayerStore();
        configStore = new GameConfigStore();
        configStore.setGameConfigs = jest.fn();
        playerStore.setAuthorizeStore = jest.fn();
        roundStore = new RoundStore(configStore, playerStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleRoundId", () => {
        it("should call handleRoundId in RoundHandlers with roundID rather 0", () => {
            // Arrange
            const roundHandler = new RoundHandlers(roundStore);
            const expectRoundId = 1;

            // Act
            roundHandler.handleRoundId(expectRoundId);

            // Assert
            expect(roundStore.roundId).toEqual(expectRoundId);
        });

        it("should call handleRoundId in RoundHandlers with roundID less than or equal 1", () => {
            // Arrange
            roundStore = new RoundStore(configStore, playerStore);
            const roundHandler = new RoundHandlers(roundStore);
            const expectRoundId = -1;

            // Act
            roundHandler.handleRoundId(expectRoundId);

            // Assert
            expect(roundStore.roundId).toEqual(0);
        });
    });
    describe("handleOwnBets", () => {
        it("should call handleOwnBets in RoundHandlers", () => {
            // Arrange
            const roundHandler = new RoundHandlers(roundStore);
            const expectOwnBets = {
                even: 2,
            };

            // Act
            roundHandler.handleOwnBets(expectOwnBets);

            // Assert
            expect(roundStore.ownBets).toEqual(expectOwnBets);
        });
    });
    describe("handleTotalBets", () => {
        it("should call handleTotalBets in RoundHandlers", () => {
            // Arrange
            const roundHandler = new RoundHandlers(roundStore);
            const expectOwnBets = {
                even: 2,
            };

            // Act
            roundHandler.handleTotalBets(expectOwnBets);

            // Assert
            expect(roundStore.totalBets).toEqual({ even: 2 });
        });
    });
    describe("handleResultHash", () => {
        it("should call handleResultHash in RoundHandlers", () => {
            // Arrange
            const roundHandler = new RoundHandlers(roundStore);
            const resultHash = new GameServiceMessage.ResultHash();

            // Act
            roundHandler.handleResultHash(resultHash);

            // Assert
            expect(roundStore.resultHash).toEqual(resultHash);
        });
    });

    describe("eventHandleList", () => {
        it("should be equal expected", () => {
            // Arrange

            const roundHandler = new RoundHandlers(roundStore);
            const expected = [
                {
                    name: GameServiceMessage.roundId,
                    handle: roundHandler.handleRoundId,
                },
                {
                    name: GameServiceMessage.OwnBets.eventName,
                    handle: roundHandler.handleOwnBets,
                },
                {
                    name: GameServiceMessage.TotalBets.eventName,
                    handle: roundHandler.handleTotalBets,
                },
                {
                    name: GameServiceMessage.ResultHash.eventName,
                    handle: roundHandler.handleResultHash,
                },
            ];

            // Assert
            expect(roundHandler.eventHandleList).toEqual(expected);
        });
    });
});
