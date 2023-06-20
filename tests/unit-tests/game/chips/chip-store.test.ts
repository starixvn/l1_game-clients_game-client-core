import { stub } from "jest-auto-stub";
import { RoundTimeStore } from "../../../../src/game/rounds";
import { MainPlayerStore } from "../../../../src/players";
import { ChipStore } from "./../../../../src/game/chips/chip-store";
describe("ChipStore", () => {
    let chipStore: ChipStore;
    let mainPlayerStore: MainPlayerStore;
    let roundTimeStore: RoundTimeStore;

    beforeEach(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        roundTimeStore = stub<RoundTimeStore>();
        chipStore = new ChipStore(mainPlayerStore, roundTimeStore);
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
        test("returns chipsByMainPlayerRate object with isShow set to true", () => {
            // Arrange
            const mainPlayerStore = stub<MainPlayerStore>();
            const roundTimeStore = stub<RoundTimeStore>({ isDisplayingResultState: false });
            const chipStore = new ChipStore(mainPlayerStore, roundTimeStore);
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
            const mainPlayerStore = stub<MainPlayerStore>();
            const roundTimeStore = stub<RoundTimeStore>({ isDisplayingResultState: true });
            const chipStore = new ChipStore(mainPlayerStore, roundTimeStore);
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
});
