import { stub } from "jest-auto-stub";
import { ConnectionStore } from "../../../../src/game/connection";
import { GameSetting } from "../../../../src/game/game-configs";
import { HideGameHandler } from "../../../../src/game/hide-game";
import { RoundRunningHandlers, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { Mediator } from "../../../../src/shared";
import { gameSettings } from "../../container.test";

describe("HideGameHandler", () => {
    let roundRunning: RoundRunningHandlers;
    let connectStore: ConnectionStore;
    let roundTimeStore: RoundTimeStore;
    let handler: HideGameHandler;
    let gameSetting: GameSetting;
    let roundStore: RoundStore;

    beforeEach(() => {
        gameSetting = new GameSetting();
        gameSetting.name = gameSettings.name;
        gameSetting.durations = gameSettings.durations;
        roundTimeStore = stub<RoundTimeStore>();
        connectStore = new ConnectionStore(new Mediator(), gameSetting);
        roundRunning = new RoundRunningHandlers(roundTimeStore, gameSetting);
        roundStore = stub<RoundStore>();
        handler = new HideGameHandler(roundRunning, connectStore, roundTimeStore, roundStore);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("handle", () => {
        it("should stop the round runner, round time store and disconnect store", async () => {
            // Arrange
            roundRunning.stopRunner = jest.fn();
            roundTimeStore.stop = jest.fn();
            connectStore.onDisconnected = jest.fn();

            // Act
            await handler.handle();

            // Assert
            expect(roundRunning.stopRunner).toHaveBeenCalledTimes(1);
            expect(roundTimeStore.stop).toHaveBeenCalledTimes(1);
            expect(connectStore.onDisconnected).toHaveBeenCalledTimes(1);
        });
    });
});
