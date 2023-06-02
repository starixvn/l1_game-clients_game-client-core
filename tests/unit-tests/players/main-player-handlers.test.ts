import { stub } from "jest-auto-stub";
import { MainPlayerStore } from "../../../src/players/main-player-store";
import { GameServiceMessage } from "../../../src/shared";
import { MainPlayerHandlers } from "./../../../src/players/main-player-handlers";

describe("MainPlayerHandlers", () => {
    let mainPlayerHandlers: MainPlayerHandlers;
    let mainPlayerStoreMock: MainPlayerStore;

    beforeEach(() => {
        mainPlayerStoreMock = stub<MainPlayerStore>();
        mainPlayerHandlers = new MainPlayerHandlers(mainPlayerStoreMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("handleStakeLevel should call setStakeLevel on store with the provided stakeLevel", () => {
        // Arrange
        const stakeLevel = {
            minBet: 1,
            maxBet: 3000,
        };

        // Act
        mainPlayerHandlers.handleStakeLevel(stakeLevel);

        // Assert
        expect(mainPlayerStoreMock.setStakeLevel).toHaveBeenCalledWith(stakeLevel);
    });

    test("handlePlayerProfile should set the properties on the store with the provided profile", () => {
        // Arrange
        const profile = stub<GameServiceMessage.User>();

        // Act
        mainPlayerHandlers.handlePlayerProfile(profile);

        // Assert
        expect(mainPlayerStoreMock.name).toBe(profile.name);
        expect(mainPlayerStoreMock.avatarId).toBe(profile.avatarId);
        expect(mainPlayerStoreMock.rate).toBe(profile.rate);
        expect(mainPlayerStoreMock.setBalance).toHaveBeenCalledWith(profile.red, profile.scoins, 0);
    });
});
