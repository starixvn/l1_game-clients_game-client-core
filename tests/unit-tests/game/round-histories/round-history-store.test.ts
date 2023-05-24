import { stub } from "jest-auto-stub";
import { RoundHistory, RoundHistoryStore } from "../../../../src/game/round-histories";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";

jest.mock("mobx");

describe("RoundHistoryStore", () => {
    let roundHistoryStore: RoundHistoryStore;
    let roundTimeStoreMock: RoundTimeStore;
    let roundStoreMock: RoundStore;
    let mockHistories: RoundHistory[];

    beforeEach(() => {
        roundTimeStoreMock = stub<RoundTimeStore>();
        roundStoreMock = stub<RoundStore>();

        roundHistoryStore = new RoundHistoryStore(roundTimeStoreMock, roundStoreMock);
        mockHistories = [
            {
                roundId: 1,
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
    });
    test.each([
        [ROUND_STATE.SHOW_ANIMATION_RESULT, true],
        [ROUND_STATE.SHOW_RESULT, true],
        [ROUND_STATE.PLACING_BET, false],
        [ROUND_STATE.BEGIN_LOCKING_BET, false],
    ])("joinRoomShowResult should return the correct value for joinGameState: %s", (joinGameState, expectedIsShowResult) => {
        roundTimeStoreMock.joinGameState = joinGameState;
        roundHistoryStore.histories = mockHistories;

        const result = roundHistoryStore.joinRoomShowResult;

        expect(result.isJoinRoom).toBe(roundHistoryStore.isJoinRoom);
        expect(result.isShowResult).toBe(expectedIsShowResult);
        expect(result.roundHistory).toEqual(roundHistoryStore.histories[0]);
    });

    test.each([
        [ROUND_STATE.SHOW_ANIMATION_RESULT, true],
        [ROUND_STATE.SHOW_RESULT, true],
        [ROUND_STATE.PLACING_BET, true],
        [ROUND_STATE.BEGIN_LOCKING_BET, false],
    ])("joinRoomHighLight should return the correct value for joinGameState: %s", (joinGameState, expectedIsShowHighLight) => {
        roundTimeStoreMock.joinGameState = joinGameState;
        roundHistoryStore.histories = mockHistories;

        const result = roundHistoryStore.joinRoomHighLight;

        expect(result.isJoinRoom).toBe(roundHistoryStore.isJoinRoom);
        expect(result.isHighLightBetWon).toBe(expectedIsShowHighLight);
        expect(result.roundHistory).toEqual(roundHistoryStore.histories[0]);
    });
});
