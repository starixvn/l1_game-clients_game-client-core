import { stub } from "jest-auto-stub";
import { GameConfigStore } from "../../../../src/game/game-configs";
import { RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { MainPlayerStore } from "../../../../src/players";
import { ChipStore } from "./../../../../src/game/chips/chip-store";
describe("ChipStore", () => {
    let chipStore: ChipStore;
    let mainPlayerStore: MainPlayerStore;
    let roundTimeStore: RoundTimeStore;
    let gameConfigStore: GameConfigStore;
    let roundStoreMock: RoundStore;

    beforeEach(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        roundTimeStore = stub<RoundTimeStore>();
        gameConfigStore = stub<GameConfigStore>();
        roundStoreMock = stub<RoundStore>();
        chipStore = new ChipStore(mainPlayerStore, roundTimeStore, gameConfigStore, roundStoreMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("initializes with empty chips object", () => {
        // Assert
        expect(chipStore.chips).toEqual({});
    });

    test("initializes with null player chip", () => {
        // Assert
        expect(chipStore.playerChip).toBeNull();
    });

    test("initializes with empty own chip object", () => {
        // Assert
        expect(chipStore.ownChip).toEqual({ betChoice: "", amount: 0 });
    });

    test("can set own chip object", () => {
        // Arrange
        const newOwnChip = { betChoice: "red", amount: 10 };
        chipStore.ownChip = newOwnChip;

        // Assert
        expect(chipStore.ownChip).toEqual(newOwnChip);
    });

    test("should reset chips", () => {
        // Arrange
        chipStore.chips = {
            1: {
                red: {
                    "1": 1,
                },
            },
        };

        // Act
        chipStore.resetChips();

        // Assert
        expect(chipStore.chips).toEqual({});
    });

    describe("Get ChipsByCurrency", () => {
        let mainPlayerStoreMock: MainPlayerStore;
        let gameConfigStoreMock: GameConfigStore;
        let roundStoreMock: RoundStore;

        beforeEach(() => {
            mainPlayerStoreMock = stub<MainPlayerStore>();
            gameConfigStoreMock = stub<GameConfigStore>();
            roundStoreMock = stub<RoundStore>();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
        test("returns chipsByMainPlayerRate object with isShow set to true", () => {
            // Arrange
            const roundTimeStore = stub<RoundTimeStore>({ isDisplayingResultState: false });
            const chipStore = new ChipStore(mainPlayerStoreMock, roundTimeStore, gameConfigStoreMock, roundStoreMock);
            const mockChips = {
                1: {
                    choice1: {
                        "1": 1,
                    },
                },
            };
            chipStore.chips = mockChips;

            // Act
            const result = chipStore.chipsByMainPlayerRate;

            // Assert
            expect(result.isShow).toBeTruthy();
        });

        test("returns chipsByMainPlayerRate object with isShow set to false", () => {
            // Arrange
            const roundTimeStore = stub<RoundTimeStore>({ isDisplayingResultState: true });
            const chipStore = new ChipStore(mainPlayerStoreMock, roundTimeStore, gameConfigStoreMock, roundStoreMock);
            const mockChips = {
                1: {
                    choice1: {
                        "1": 1,
                    },
                },
            };
            chipStore.chips = mockChips;

            // Act
            const result = chipStore.chipsByMainPlayerRate;

            // Assert
            expect(result.isShow).toBeFalsy();
        });
    });

    describe("getChipValueByCurrency", () => {
        it("should return the chip amount converted by currency", () => {
            // Arrange
            const mockChipAmount = { 1: 10 };
            const mockPlayerRate = 2;
            const mockChipRate = 0.5;
            const expectedChipValueByCurrency = { "0.25": 10 };

            // Action
            const chipAmountConvert = chipStore.convertChipToPlayerRate(mockChipAmount, mockPlayerRate, mockChipRate);

            // Assert
            expect(chipAmountConvert).toEqual(expectedChipValueByCurrency);
        });
    });

    describe("chipValuesByStakeLevel", () => {
        it("should return an array of chip values within the specified range", () => {
            // Act
            const gameConfigStore = stub<GameConfigStore>({ chips: ["1", "5", "10", "25", "50", "100"], minBet: 5, maxBet: 50 });
            const mainPlayerStore = stub<MainPlayerStore>({ stakeLevel: { maxBet: 50, minBet: 5 } });
            const roundStore = stub<RoundStore>({ minBet: 5, maxBet: 50 });
            const chipStoreMock = new ChipStore(mainPlayerStore, roundTimeStore, gameConfigStore, roundStore);

            // Arrange
            const result = chipStoreMock.chipValuesByStakeLevel;

            // Assert
            expect(result).toEqual([5, 10, 25, 50]);
        });
        it("should return an empty array if no chips are within the specified range", () => {
            // Act
            const gameConfigStore = stub<GameConfigStore>({ chips: ["1", "5", "10", "25", "50", "100"], minBet: 500, maxBet: 1000 });
            const chipStoreMock = new ChipStore(mainPlayerStore, roundTimeStore, gameConfigStore, roundStoreMock);

            // Arrange
            const result = chipStoreMock.chipValuesByStakeLevel;

            // Assert
            expect(result).toEqual([]);
        });
        it("should return an empty array if the chip values are not numbers", () => {
            // Act
            gameConfigStore.chips = ["1", "5", "10", "25", "50", "100"];
            gameConfigStore.minBet = 5;
            gameConfigStore.maxBet = 50;
            // Arrange
            const result = chipStore.chipValuesByStakeLevel;
            // Assert
            expect(result).toEqual([]);
        });
    });
});
