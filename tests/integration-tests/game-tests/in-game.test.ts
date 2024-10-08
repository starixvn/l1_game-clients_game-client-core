import { ConnectionHandlers } from "../../../src/game/connection";
import { GameConfigStore } from "../../../src/game/game-configs";
import { RoundStore } from "../../../src/game/rounds";
import { container } from "../stubs/container";
import { gameData } from "../stubs/game-data";

export const inGameTest = () => {
    describe("Player join game", () => {
        it("Round store should has round Id", () => {
            // arrange
            const roundStore = container.resolve(RoundStore);
            roundStore.roundId = 0;
            const inGameHandler = container.resolve(ConnectionHandlers.InGameHandler);

            // act
            inGameHandler.handle();

            // assert
            expect(roundStore.roundId).toBe(gameData.roundId);
        });

        it("Game config Store should has minBet, maxBet, odds, chips", () => {
            // arrange
            const gameConfigStore = container.resolve(GameConfigStore);
            gameConfigStore.minBet = 0;
            gameConfigStore.maxBet = 0;
            gameConfigStore.chips = [];
            gameConfigStore.odds = {};
            const inGameHandler = container.resolve(ConnectionHandlers.InGameHandler);
            const { gameConfigs } = gameData;

            // act
            inGameHandler.handle();

            // assert
            expect(gameConfigStore.minBet).toBe(gameConfigs.minBet);
            expect(gameConfigStore.maxBet).toBe(gameConfigs.maxBet);
            expect(gameConfigStore.odds).toEqual(gameConfigs.odds);
            expect(gameConfigStore.chips).toEqual(gameConfigs.chips);
        });
    });
};
