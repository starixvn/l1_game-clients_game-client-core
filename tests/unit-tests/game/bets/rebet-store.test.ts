import { stub } from "jest-auto-stub";
import { reaction } from "mobx";
import { ReBetStore } from "../../../../src/game/bets";
import { GameSetting } from "../../../../src/game/game-configs";
import { RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { StorageManager } from "./../../../../src/shared/utils/storage-manager";

jest.mock("mobx", () => ({
    ...jest.requireActual("mobx"),
    reaction: jest.fn(),
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

    test("constructor - should set up auto-observable and updateStorageBetBet reaction ownBets is not empty", () => {
        // Arrange
        roundStore = stub<RoundStore>({ ownBets: { even: 1 }, clientRoundId: 1 });
        reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);
        const updateStorageBetBetSpy = jest.spyOn(reBetStore, "updateStorageBetBet");
        const reactionMock = reaction as jest.Mock;
        reactionMock.mockImplementation((condition, action) => {
            if (condition()) {
                action();
            }
        });

        // Act
        reBetStore.updateStorageBetBet();

        // Assert
        expect(updateStorageBetBetSpy).toHaveBeenCalled();
    });

    describe("updateStorageBetBet", () => {
        test.each([
            [1, true],
            [0, false],
            [2, true],
            [3, false],
        ])("when clientRoundId is %i and isStartPlacingBet is %p", (clientRoundId, isStartPlacingBet) => {
            // Arrange
            roundStore = stub<RoundStore>({ ownBets: { even: 1 }, clientRoundId: clientRoundId });
            roundTimeStore = stub<RoundTimeStore>({ isStartPlacingBet });
            const reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);

            // Act
            reBetStore.updateStorageBetBet();
            StorageManager.set = jest.fn();

            // Assert
            if (clientRoundId > 0 && !isStartPlacingBet) {
                expect(reBetStore.ruleShowReBet).toEqual({ roundId: clientRoundId });
            } else {
                expect(reBetStore.ruleShowReBet).toEqual({ roundId: 0 });
                expect(StorageManager.set).not.toHaveBeenCalled();
            }
        });
    });

    describe("isShowBtnReBet", () => {
        it("should return false when roundId is 0", () => {
            // Arrange
            Object.defineProperty(roundTimeStore, "isPlacingBet", {
                get: jest.fn(() => true),
            });
            roundStore = stub<RoundStore>({ clientRoundId: 5 });
            reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);
            reBetStore.ruleShowReBet = { roundId: 0 };

            // Act
            const result = reBetStore.isShowBtnReBet;

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when isPlacingBet is false", () => {
            // Arrange
            Object.defineProperty(roundTimeStore, "isPlacingBet", {
                get: jest.fn(() => false),
            });
            roundStore = stub<RoundStore>({ clientRoundId: 5 });
            reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);
            reBetStore.ruleShowReBet = { roundId: 0 };

            // Act
            const result = reBetStore.isShowBtnReBet;

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when roundId is not equal to clientRoundId - 1", () => {
            // Arrange
            Object.defineProperty(roundTimeStore, "isPlacingBet", {
                get: jest.fn(() => true),
            });
            roundStore = stub<RoundStore>({ clientRoundId: 5 });
            reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);
            reBetStore.ruleShowReBet = { roundId: 2 };

            // Act
            const result = reBetStore.isShowBtnReBet;

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when roundId is equal to clientRoundId - 1", () => {
            // Arrange
            Object.defineProperty(roundTimeStore, "isPlacingBet", {
                get: jest.fn(() => true),
            });
            roundStore = stub<RoundStore>({ clientRoundId: 5 });
            reBetStore = new ReBetStore(roundStore, gameSetting, roundTimeStore);
            reBetStore.ruleShowReBet = { roundId: 4 };

            // Act
            const result = reBetStore.isShowBtnReBet;

            // Assert
            expect(result).toBe(true);
        });
    });
});
