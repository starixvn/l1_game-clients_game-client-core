import { stub } from "jest-auto-stub";
import { SiteConfigs } from "../../../../src/configs";
import { AroundTablePlayersStore } from "../../../../src/game/around-table-players/around-table-players-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";
import { NumberUtils } from "../../../../src/shared/utils/number-utils";

jest.mock("../../../../src/shared/utils/number-utils", () => ({ NumberUtils: { getValueByCurrency: jest.fn() } }));

describe("AroundTablePlayersStore", () => {
    let aroundTablePlayersStore: AroundTablePlayersStore;
    let siteConfigs: SiteConfigs;
    let mainPlayerStore: MainPlayerStore;

    beforeEach(() => {
        siteConfigs = stub<SiteConfigs>();
        mainPlayerStore = stub<MainPlayerStore>();
        aroundTablePlayersStore = new AroundTablePlayersStore(siteConfigs, mainPlayerStore);
    });

    describe("setAroundTablePlayers", () => {
        it("should convert rate for balance before set around table players", () => {
            // arrange
            const players = {
                player1: { id: "player1", name: "John", avatarId: 123, red: 100, rate: 0.5, type: true },
                player2: { id: "player2", name: "John2", avatarId: 1, red: 100, rate: 5, type: true },
            };
            mainPlayerStore.rate = 1;
            const expected = {
                player1: { id: "player1", name: "John", avatarId: 123, red: 50, rate: 0.5, type: true },
                player2: { id: "player2", name: "John2", avatarId: 1, red: 500, rate: 5, type: true },
            };
            (NumberUtils.getValueByCurrency as jest.Mock)
                .mockReturnValueOnce(expected.player1.red)
                .mockReturnValueOnce(expected.player2.red);

            // act
            aroundTablePlayersStore.setAroundTablePlayers(players);

            // assert
            expect(aroundTablePlayersStore.aroundTablePlayers).toEqual(expected);
        });
    });

    test("updateAroundTablePlayer should update the aroundTablePlayer and aroundTablePlayers properties on the store", () => {
        // arrange
        const aroundTablePlayer = {
            id: "player1",
            name: "John",
            avatarId: 123,
            red: 100,
            rate: 0.5,
            type: true,
        };
        mainPlayerStore.rate = 1;
        (NumberUtils.getValueByCurrency as jest.Mock).mockReturnValueOnce(50);

        // act
        aroundTablePlayersStore.updateAroundTablePlayer(aroundTablePlayer);

        // arrange
        expect(aroundTablePlayersStore.aroundTablePlayer).toEqual({ ...aroundTablePlayer, red: 50 });
        expect(aroundTablePlayersStore.aroundTablePlayers[aroundTablePlayer.id]).toStrictEqual({ ...aroundTablePlayer, red: 50 });
        expect(NumberUtils.getValueByCurrency).toHaveBeenCalledWith(aroundTablePlayer.red, mainPlayerStore.rate, aroundTablePlayer.rate);
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
        it("should update maxBalanceDisplay to 99999 when systemType is VG", () => {
            // Arrange
            const siteConfigsMock = stub<SiteConfigs>({ systemType: "VG" });
            const aroundTablePlayersStoreMock = new AroundTablePlayersStore(siteConfigsMock, mainPlayerStore);
            // Act
            aroundTablePlayersStoreMock.updateMaxBalanceDisplay();

            // Assert
            expect(aroundTablePlayersStoreMock.maxBalanceDisplay).toBe(99999);
        });

        it("should not update maxBalanceDisplay when systemType is not VG", () => {
            // Arrange
            const siteConfigsMock = stub<SiteConfigs>({ systemType: "SG" });
            const aroundTablePlayersStoreMock = new AroundTablePlayersStore(siteConfigsMock, mainPlayerStore);

            // Act
            aroundTablePlayersStoreMock.updateMaxBalanceDisplay();

            // Assert
            expect(aroundTablePlayersStoreMock.maxBalanceDisplay).not.toBe(99999);
        });
    });
});
