import { stub } from "jest-auto-stub";
import { SiteConfigs } from "../../../../src/configs";
import { AroundTablePlayersStore } from "../../../../src/game/around-table-players/around-table-players-store";

describe("AroundTablePlayersStore", () => {
    let aroundTablePlayersStore: AroundTablePlayersStore;
    let siteConfigs: SiteConfigs;

    beforeEach(() => {
        siteConfigs = stub<SiteConfigs>();
        aroundTablePlayersStore = new AroundTablePlayersStore(siteConfigs);
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

        expect(aroundTablePlayersStore.outGamePlayerId).toBe(playerId);
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

    describe("updateMaxBalanceDisplay", () => {
        it("should update maxBalanceDisplay to 99999 when systemType is SC2", () => {
            // Arrange
            const siteConfigsMock = stub<SiteConfigs>({ systemType: "SC2" });
            const aroundTablePlayersStoreMock = new AroundTablePlayersStore(siteConfigsMock);
            // Act
            aroundTablePlayersStoreMock.updateMaxBalanceDisplay();

            // Assert
            expect(aroundTablePlayersStoreMock.maxBalanceDisplay).toBe(99999);
        });

        it("should not update maxBalanceDisplay when systemType is not SC2", () => {
            // Arrange
            const siteConfigsMock = stub<SiteConfigs>({ systemType: "SC1" });
            const aroundTablePlayersStoreMock = new AroundTablePlayersStore(siteConfigsMock);

            // Act
            aroundTablePlayersStoreMock.updateMaxBalanceDisplay();

            // Assert
            expect(aroundTablePlayersStoreMock.maxBalanceDisplay).not.toBe(99999);
        });
    });
});
