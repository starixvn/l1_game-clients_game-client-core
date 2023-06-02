import { AroundTablePlayersStore } from "../../../src/players";

describe("AroundTablePlayersStore", () => {
    let aroundTablePlayersStore: AroundTablePlayersStore;

    beforeEach(() => {
        aroundTablePlayersStore = new AroundTablePlayersStore();
    });

    test("updateAroundTablePlayer should update the aroundTablePlayer and aroundTablePlayers properties on the store", () => {
        const aroundTablePlayer = {
            id: "player1",
            name: "John",
            avatarId: 123,
            red: 100,
            type: true,
        };
        aroundTablePlayersStore.updateAroundTablePlayer(aroundTablePlayer);

        expect(aroundTablePlayersStore.aroundTablePlayer).toStrictEqual(aroundTablePlayer);
        expect(aroundTablePlayersStore.aroundTablePlayers[aroundTablePlayer.id]).toStrictEqual(aroundTablePlayer);
    });

    test("removeAroundTablePlayer should remove the specified player from the aroundTablePlayers property on the store", () => {
        const playerId = "player1";
        aroundTablePlayersStore.aroundTablePlayers[playerId] = {
            id: playerId,
            name: "John",
            avatarId: 123,
            red: 100,
            type: true,
        };
        const aroundTablePlayerOutGame = { playerId };
        aroundTablePlayersStore.removeAroundTablePlayer(aroundTablePlayerOutGame);

        expect(aroundTablePlayersStore.aroundTablePlayerIdOutGame).toBe(playerId);
        expect(aroundTablePlayersStore.aroundTablePlayers[playerId]).toBeUndefined();
    });

    test("resetAroundTablePlayersStore should reset the aroundTablePlayer and aroundTablePlayers properties on the store", () => {
        aroundTablePlayersStore.aroundTablePlayer = {
            id: "player1",
            name: "John",
            avatarId: 123,
            red: 100,
            type: true,
        };

        aroundTablePlayersStore.aroundTablePlayers = {
            player1: {
                id: "player1",
                name: "John",
                avatarId: 123,
                red: 100,
                type: true,
            },
        };
        aroundTablePlayersStore.resetAroundTablePlayersStore();

        expect(aroundTablePlayersStore.aroundTablePlayer).toBeNull();
        expect(aroundTablePlayersStore.aroundTablePlayers).toEqual({});
    });
});
