import { stub } from "jest-auto-stub";
import { AroundTablePlayersStore } from "../../../../src/game/around-table-players";
import { ChipStore } from "../../../../src/game/chips";
import { ConnectionHandlers, ConnectionStore } from "../../../../src/game/connection";
import { GameConfigStore, GameSetting } from "../../../../src/game/game-configs";
import { JoinGameHandler } from "../../../../src/game/join-game";
import { RoundHistoryStore } from "../../../../src/game/round-histories";
import { RoundRunningHandlers, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { MainPlayerStore } from "../../../../src/players";
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
    let mainPlayerStore: MainPlayerStore;
    let connection: ConnectionHandlers.ConnectHandler;
    let chipStore: ChipStore;
    let aroundTablePlayersStore: AroundTablePlayersStore;
    let roundHistoryStore: RoundHistoryStore;

    beforeEach(() => {
        roundTimeStore = stub<RoundTimeStore>();
        chipStore = stub<ChipStore>();
        aroundTablePlayersStore = stub<AroundTablePlayersStore>();
        roundHistoryStore = stub<RoundHistoryStore>();
        roundRunning = new RoundRunningHandlers(roundTimeStore, gameSetting);
        connectStore = new ConnectionStore(new Mediator(), gameSetting);
        connectStore.initBaseListener = jest.fn();
        connection = new ConnectionHandlers.ConnectHandler(connectStore, siteConfigs, gameSettings);
        roundStore = new RoundStore(gameConfigStore, mainPlayerStore);
        handler = new JoinGameHandler(connection, roundStore, chipStore, aroundTablePlayersStore, roundHistoryStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handle", () => {
        it("should stop the round runner, round time store and disconnect store", async () => {
            // Arrange
            roundStore.resetRoundStore = jest.fn();
            chipStore.resetChips = jest.fn();
            aroundTablePlayersStore.resetAroundTablePlayersStore = jest.fn();
            roundHistoryStore.resetRoundHistoryStore = jest.fn();
            connection.handle = jest.fn();

            // Act
            await handler.handle();

            // Assert
            expect(roundStore.resetRoundStore).toHaveBeenCalledTimes(1);
            expect(chipStore.resetChips).toHaveBeenCalledTimes(1);
            expect(aroundTablePlayersStore.resetAroundTablePlayersStore).toHaveBeenCalledTimes(1);
            expect(roundHistoryStore.resetRoundHistoryStore).toHaveBeenCalledTimes(1);
            expect(connection.handle).toHaveBeenCalledTimes(1);
        });
    });
});
