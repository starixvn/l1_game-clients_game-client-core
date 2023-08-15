import { AppStore } from "../../../../src/app/app-store";
import { GameConfigHandlers, GameConfigStore } from "../../../../src/game/game-configs";
import { GameServiceMessage } from "../../../../src/shared";

describe("GameConfigHandlers test", () => {
    describe("handleGameConfigs", () => {
        let configStore: GameConfigStore;
        let appStore: AppStore;
        let handler: GameConfigHandlers;
        const gameConfig = new GameServiceMessage.GameConfigs();
        beforeEach(() => {
            configStore = new GameConfigStore();
            configStore.setGameConfigs = jest.fn();
            appStore = new AppStore();
            handler = new GameConfigHandlers(configStore, appStore);
        });
        it("should call setGameConfigs in GameConfigStore", () => {
            // act
            handler.handleGameConfigs(gameConfig);

            // assert
            expect(configStore.setGameConfigs).toHaveBeenCalledWith(gameConfig);
        });

        it("should set appStore isLoading = false", () => {
            // arrange
            appStore.isLoading = true;

            // act
            handler.handleGameConfigs(gameConfig);

            // assert
            expect(appStore.isLoading).toBe(false);
        });
    });
    describe("eventHandleList", () => {
        it("should be equal expected", () => {
            // arrange
            const configStore = new GameConfigStore();
            const appStore = new AppStore();
            const handler = new GameConfigHandlers(configStore, appStore);
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
