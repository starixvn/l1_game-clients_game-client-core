import { ChipStore } from "./../../../../src/game/chips/chip-store";
describe("ChipStore", () => {
    let chipStore: ChipStore;

    beforeEach(() => {
        chipStore = new ChipStore();
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
});
