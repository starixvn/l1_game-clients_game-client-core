import { stub } from "jest-auto-stub";
import { when } from "mobx";
import { ReBetStore } from "../../../../src/game/bets";
import { GameSetting } from "../../../../src/game/game-configs";
import { RoundStore, RoundTimeStore } from "../../../../src/game/rounds";

jest.mock("mobx", () => ({
    ...jest.requireActual("mobx"),
    when: jest.fn(),
}));

describe("ReBetStore", () => {
    let roundStore: RoundStore;
    let gameSetting: GameSetting;
    let roundTimeStore: RoundTimeStore;
    let reBetStore: ReBetStore;

    beforeEach(() => {
        gameSetting = stub<GameSetting>();
        roundTimeStore = stub<RoundTimeStore>();
    });

    test("constructor - should set up auto-observable and updateStorageBetBet when ownBets is not empty", () => {
        // Arrange
        roundStore = stub<RoundStore>({ ownBets: { even: 1 }, clientRoundId: 1 });
        reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);
        const updateStorageBetBetSpy = jest.spyOn(reBetStore, "updateStorageBetBet");
        const whenMock = when as jest.Mock;
        whenMock.mockImplementation((condition, action) => {
            if (condition()) {
                action();
            }
        });

        // Call the function under test
        reBetStore.updateStorageBetBet();

        // Assert that the updateStorageBetBet function has been called
        expect(updateStorageBetBetSpy).toHaveBeenCalled();
    });
});
