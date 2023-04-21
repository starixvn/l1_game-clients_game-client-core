import { GameConfigHandlers, GameConfigStore } from "../../../../src/game/game-configs";
import { GameServiceMessage } from "../../../../src/shared";

describe("GameConfigHandlers test", () => {
    describe("handleGameConfigs", () => {
        it("should call setGameConfigs in GameConfigStore", () => {
            // arrange
            const store = new GameConfigStore();
            store.setGameConfigs = jest.fn();
            const handler = new GameConfigHandlers(store);
            const gameConfig = new GameServiceMessage.GameConfigs();

            // act
            handler.handleGameConfigs(gameConfig);

            // assert
            expect(store.setGameConfigs).toHaveBeenCalledWith(gameConfig);
        });
    });
    describe("eventHandleList", () => {
        it("should be equal expected", () => {
            // arrange
            const store = new GameConfigStore();
            const handler = new GameConfigHandlers(store);
            const expected = [
                {
                    name: GameServiceMessage.GameConfigs.eventName,
                    handle: handler.handleGameConfigs,
                },
            ];

            // assert
            expect(handler.eventHandleList).toEqual(expected);
        });
    });
});
