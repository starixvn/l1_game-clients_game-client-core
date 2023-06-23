import { stub } from "jest-auto-stub";
import { ConnectionStore } from "../../../../src/game/connection";
import { GameSetting } from "../../../../src/game/game-configs";
import { HideGameHandler } from "../../../../src/game/hide-game";
import { RoundRunningHandlers, RoundTimeStore } from "../../../../src/game/rounds";
import { gameSettings } from "../../container.test";

describe("HideGameHandler", () => {
    let roundRunning: RoundRunningHandlers;
    let connectStore: ConnectionStore;
    let roundTimeStore: RoundTimeStore;
    let handler: HideGameHandler;
    let gameSetting: GameSetting;

    beforeEach(() => {
        gameSetting = new GameSetting();
        gameSetting.name = gameSettings.name;
        gameSetting.durations = gameSettings.durations;
        roundTimeStore = stub<RoundTimeStore>();
        connectStore = stub<ConnectionStore>();
        roundRunning = new RoundRunningHandlers(roundTimeStore, gameSetting);
        handler = new HideGameHandler(roundRunning, connectStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handle", () => {
        it("should resetRoundTimeStore the round runner, round time store and disconnect store", async () => {
            // Arrange
            roundRunning.stopRunner = jest.fn();
            connectStore.onDisconnected = jest.fn();

            // Act
            await handler.handle();

            // Assert
            expect(roundRunning.stopRunner).toHaveBeenCalledTimes(1);
            expect(connectStore.onDisconnected).toHaveBeenCalledTimes(1);
        });
    });
});
