import { stub } from "jest-auto-stub";
import { AroundTablePlayersStore } from "../../../../src/game/around-table-players";
import { ChipStore } from "../../../../src/game/chips";
import { ConnectionHandlers, ConnectionStore } from "../../../../src/game/connection";
import { JoinGameHandler } from "../../../../src/game/join-game";
import { RoundHistoryStore } from "../../../../src/game/round-histories";
import { RoundRunningHandlers, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { SettlementStore } from "../../../../src/game/settlements";
import { gameSettings, siteConfigs } from "../../container.test";

describe("JoinGameHandler", () => {
    let roundRunning: RoundRunningHandlers;
    let connectStore: ConnectionStore;
    let roundTimeStore: RoundTimeStore;
    let handler: JoinGameHandler;
    let roundStore: RoundStore;
    let connection: ConnectionHandlers.ConnectHandler;
    let chipStore: ChipStore;
    let aroundTablePlayersStore: AroundTablePlayersStore;
    let roundHistoryStore: RoundHistoryStore;
    let settlementStore: SettlementStore;

    beforeEach(() => {
        settlementStore = stub<SettlementStore>();
        roundTimeStore = stub<RoundTimeStore>();
        chipStore = stub<ChipStore>();
        aroundTablePlayersStore = stub<AroundTablePlayersStore>();
        roundHistoryStore = stub<RoundHistoryStore>();
        roundRunning = stub<RoundRunningHandlers>();
        connectStore = stub<ConnectionStore>();
        connectStore.initBaseListener = jest.fn();
        roundStore = stub<RoundStore>();
        connection = new ConnectionHandlers.ConnectHandler(connectStore, siteConfigs, gameSettings);

        handler = new JoinGameHandler(connection, roundStore, chipStore, aroundTablePlayersStore, roundHistoryStore, settlementStore);
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
            settlementStore.resetSettlementStore = jest.fn();
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
