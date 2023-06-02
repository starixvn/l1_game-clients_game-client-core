import { MainPlayerStore } from "../../../src/players/main-player-store";

describe("MainPlayerStore", () => {
    let mainPlayerStore: MainPlayerStore;

    beforeEach(() => {
        mainPlayerStore = new MainPlayerStore();
    });

    test("setAuthorizeStore should set the properties on the store with the provided user", () => {
        // Arrange
        const user = {
            UID: 1,
            name: "John",
            avatarId: 123,
            red: 100,
            scoins: 50,
            availSpins: 5,
            currency: "USD",
            offerGames: [{ gameId: 1 }, { gameId: 2 }],
            fractionalOddsFormat: true,
            isDisplayPlayerCurrency: true,
            type: true,
            minBet: 1,
            maxBet: 3000,
            joinedOn: "join",
        };

        // Act
        mainPlayerStore.setAuthorizeStore(user);

        // Assert
        expect(mainPlayerStore.UID).toBe(user.UID);
        expect(mainPlayerStore.name).toBe(user.name);
        expect(mainPlayerStore.avatarId).toBe(user.avatarId);
        expect(mainPlayerStore.balance).toBe(user.red);
        expect(mainPlayerStore.scoin).toBe(user.scoins);
        expect(mainPlayerStore.availSpins).toBe(user.availSpins);
        expect(mainPlayerStore.currency).toBe(user.currency);
        expect(mainPlayerStore.offerGames).toStrictEqual(user.offerGames);
        expect(mainPlayerStore.fractionalOddsFormat).toBe(user.fractionalOddsFormat);
        expect(mainPlayerStore.displayPlayerCurrency).toBe(user.isDisplayPlayerCurrency);
    });

    test("setBalance should update the balance, scoin, and availSpins properties on the store", () => {
        // Arrange
        const balance = 100;
        const scoin = 50;
        const availSpins = 5;

        // Act
        mainPlayerStore.setBalance(balance, scoin, availSpins);

        // Assert
        expect(mainPlayerStore.balance).toBe(balance);
        expect(mainPlayerStore.scoin).toBe(scoin);
        expect(mainPlayerStore.availSpins).toBe(availSpins);
    });

    test("setStakeLevel should update the stakeLevel property on the store", () => {
        // Arrange
        const stakeLevel = { minBet: 10, maxBet: 100 };

        // Act
        mainPlayerStore.setStakeLevel(stakeLevel);

        // Assert
        expect(mainPlayerStore.stakeLevel).toStrictEqual(stakeLevel);
    });
});
