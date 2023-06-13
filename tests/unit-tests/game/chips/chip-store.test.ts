import { stub } from "jest-auto-stub";
import { MainPlayerStore } from "../../../../src/players";
import { ChipStore } from "./../../../../src/game/chips/chip-store";
describe("ChipStore", () => {
    let chipStore: ChipStore;
    let mainPlayerStore: MainPlayerStore;

    beforeEach(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        chipStore = new ChipStore(mainPlayerStore);
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
        // Add some initial chips to the store
        chipStore.chips = {
            1: {
                red: {
                    "1": 1,
                },
            },
        };

        // Reset the chips
        chipStore.resetChips();

        // Assert that the chips object is empty
        expect(chipStore.chips).toEqual({});
    });

    describe("Get ChipsByCurrency", () => {
        it("should return the chips converted by currency", () => {
            // Mock the required dependencies
            const mockChips = {
                1: {
                    test1: { 1: 10 },
                    test2: { 2: 5 },
                },
            };
            chipStore.chips = mockChips;
            mainPlayerStore.rate = 1;

            const expectedChipsByCurrency = {
                test1: { "1": 10 },
                test2: { "2": 5 },
            };

            expect(chipStore.chipsByCurrency).toEqual(expectedChipsByCurrency);
        });
    });

    describe("getChipValueByCurrency", () => {
        it("should return the chip amount converted by currency", () => {
            // Mock the required dependencies
            const mockChipAmount = { 1: 10 };
            const mockPlayerRate = 2;
            const mockChipRate = 0.5;

            const expectedChipValueByCurrency = { "0.25": 10 };

            expect(chipStore.convertChipValueFollowCurrency(mockChipAmount, mockPlayerRate, mockChipRate)).toEqual(
                expectedChipValueByCurrency
            );
        });
    });
});
