import { stub } from "jest-auto-stub";
import { AroundTablePlayersStore } from "../../../src/players/around-table-players-store";
import { AroundTablePlayerHandlers } from "./../../../src/players/around-table-players-handlers";

describe("AroundTablePlayerHandlers", () => {
    let aroundTablePlayerHandlers: AroundTablePlayerHandlers;
    let aroundTablePlayersStoreMock: AroundTablePlayersStore;
    const mockAroundTablePlayer = {
        id: "1as",
        name: "test",
        red: 5,
        avatarId: 1,
        type: false,
    };

    beforeEach(() => {
        aroundTablePlayersStoreMock = stub<AroundTablePlayersStore>();

        aroundTablePlayerHandlers = new AroundTablePlayerHandlers(aroundTablePlayersStoreMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("handlePlayer should call updateAroundTablePlayer on otherPlayersStore with the provided aroundTablePlayer", () => {
        // Act
        aroundTablePlayerHandlers.handlePlayer(mockAroundTablePlayer);

        // Assert
        expect(aroundTablePlayersStoreMock.updateAroundTablePlayer).toHaveBeenCalledWith(mockAroundTablePlayer);
    });

    test("handlePlayers should update the aroundTablePlayers property on otherPlayersStore with the provided aroundTablePlayers", () => {
        // Arrange
        const aroundTablePlayers = {
            "123": mockAroundTablePlayer,
        };

        // Act
        aroundTablePlayerHandlers.handlePlayers(aroundTablePlayers);

        // Assert
        expect(aroundTablePlayersStoreMock.aroundTablePlayers).toBe(aroundTablePlayers);
    });

    test("handlePlayerOutGame should call removeAroundTablePlayer on otherPlayersStore with the provided aroundTablePlayerOutGame", () => {
        // Arrange
        const aroundTablePlayerOutGame = { playerId: "213aa" };

        // Act
        aroundTablePlayerHandlers.handlePlayerOutGame(aroundTablePlayerOutGame);

        // Assert
        expect(aroundTablePlayersStoreMock.removeAroundTablePlayer).toHaveBeenCalledWith(aroundTablePlayerOutGame);
    });
});
