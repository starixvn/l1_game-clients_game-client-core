import { stub } from "jest-auto-stub";
import { ConnectionHandlers, ConnectionStore } from "../../../../src/game/connection";
import { GameConfigStore, GameSetting } from "../../../../src/game/game-configs";
import { JoinGameHandler } from "../../../../src/game/join-game";
import { RoundRunningHandlers, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { PlayerStore } from "../../../../src/players";
import { Mediator } from "../../../../src/shared";
import { gameSettings, siteConfigs } from "../../container.test";

describe("JoinGameHandler", () => {
    let roundRunning: RoundRunningHandlers;
    let connectStore: ConnectionStore;
    let roundTimeStore: RoundTimeStore;
    let handler: JoinGameHandler;
    let gameSetting: GameSetting;
    let roundStore: RoundStore;
    let gameConfigStore: GameConfigStore;
    let playerStore: PlayerStore;
    let connection: ConnectionHandlers.ConnectHandler;

    beforeEach(() => {
        roundTimeStore = stub<RoundTimeStore>();
        roundRunning = new RoundRunningHandlers(roundTimeStore, gameSetting);
        connectStore = new ConnectionStore(new Mediator(), gameSetting);
        connectStore.initBaseListener = jest.fn();
        connection = new ConnectionHandlers.ConnectHandler(connectStore, siteConfigs, gameSettings);
        roundStore = new RoundStore(gameConfigStore, playerStore);
        handler = new JoinGameHandler(connection, roundStore, roundTimeStore);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("handle", () => {
        it("should stop the round runner, round time store and disconnect store", async () => {
            // Arrange
            roundStore.resetRoundStore = jest.fn();
            connection.handle = jest.fn();

            // Act
            await handler.handle();

            // Assert
            expect(roundStore.resetRoundStore).toHaveBeenCalledTimes(1);
            expect(connection.handle).toHaveBeenCalledTimes(1);
        });
    });
});
