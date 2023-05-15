import { ChipHandlers, ChipStore } from "../../../../src/game/chips";
import { GameServiceMessage } from "../../../../src/shared";

describe("ChipHandlers", () => {
    let chipHandlers: ChipHandlers;
    let chipStoreMock: ChipStore;

    beforeEach(() => {
        chipStoreMock = new ChipStore();
        chipStoreMock.chips = {
            "1": {
                even: {
                    "5": 4,
                },
            },
        };

        chipHandlers = new ChipHandlers(chipStoreMock);
    });

    test("can handle chips message", () => {
        // Arrange
        const chipsMessage = {
            "1": {
                even: {
                    "5": 4,
                },
            },
        };

        // Act
        chipHandlers.handleChips(chipsMessage);

        // Assert
        expect(chipStoreMock.chips).toEqual(chipsMessage);
    });

    test("can handle player chip message", () => {
        // Arrange
        const playerChipMessage = {
            playerId: "1",
            betChoice: "even",
            amount: 5,
            red: 10,
        };

        // Act
        chipHandlers.handlePlayerChip(playerChipMessage);

        // Assert
        expect(chipStoreMock.playerChip).toEqual(playerChipMessage);
    });

    test("can handle own chip message", () => {
        // Arrange
        const ownChipMessage = {
            playerId: 1,
            betChoice: "even",
            amount: 10,
            red: 10,
        };

        // Act
        chipHandlers.handleOwnChip(ownChipMessage);

        // Assert
        expect(chipStoreMock.ownChip).toEqual(ownChipMessage);
    });

    test("eventHandleList contains the correct handlers", () => {
        // Arrange
        const expectedEventHandleList = [
            {
                name: GameServiceMessage.Chips.eventName,
                handle: chipHandlers.handleChips,
            },
            {
                name: GameServiceMessage.PlayerChip.eventName,
                handle: chipHandlers.handlePlayerChip,
            },
            {
                name: GameServiceMessage.OwnChip.eventName,
                handle: chipHandlers.handleOwnChip,
            },
        ];

        // Assert
        expect(chipHandlers.eventHandleList).toEqual(expectedEventHandleList);
    });
});
