import { stub } from "jest-auto-stub";
import { RoundHistory, RoundHistoryHandlers, RoundHistoryStore } from "../../../../src/game/round-histories";
import { GameServiceMessage } from "../../../../src/shared";

// Create a stub for RoundHistoryStore and RoundTimeStore using ts-auto-mock
const roundHistoryStoreStub = stub<RoundHistoryStore>();

describe("RoundHistoryHandlers", () => {
    let roundHistoryHandlers: RoundHistoryHandlers;

    beforeEach(() => {
        roundHistoryHandlers = new RoundHistoryHandlers(roundHistoryStoreStub);
    });

    test("handleRoundHistory should update roundHistoryStore and roundTimeStore correctly", () => {
        // Create mock data
        const roundHistories: RoundHistory[] = [
            {
                roundId: 2176119,
                result: {
                    red1: false,
                    red2: false,
                    red3: true,
                    red4: true,
                },
                settlementResult: {
                    odd: false,
                    even: true,
                    red2: true,
                    red3: false,
                    red4: false,
                    white3: false,
                    white4: false,
                },
            },
        ];

        // Call the handleRoundHistory method
        roundHistoryHandlers.handleRoundHistory(roundHistories);

        // Assert that roundHistoryStore.histories is updated correctly
        expect(roundHistoryStoreStub.histories).toEqual(roundHistories);
    });

    test("eventHandleList should contain handleRoundHistory for GameServiceMessage.roundHistory event", () => {
        // Assert that the eventHandleList contains the correct handleRoundHistory function for GameServiceMessage.roundHistory event
        expect(roundHistoryHandlers.eventHandleList).toContainEqual({
            name: GameServiceMessage.roundHistory,
            handle: roundHistoryHandlers.handleRoundHistory,
        });
    });
});
