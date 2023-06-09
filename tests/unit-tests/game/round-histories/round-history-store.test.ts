import { stub } from "jest-auto-stub";
import { GameSetting } from "../../../../src/game/game-configs";
import { RoundHistory, RoundHistoryStore } from "../../../../src/game/round-histories";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";

jest.mock("mobx");

describe("RoundHistoryStore", () => {
    let roundHistoryStore: RoundHistoryStore;
    let roundTimeStoreMock: RoundTimeStore;
    let roundStoreMock: RoundStore;
    let mockHistories: RoundHistory[];
    let gameSetting: GameSetting;

    beforeEach(() => {
        roundTimeStoreMock = stub<RoundTimeStore>();
        roundStoreMock = stub<RoundStore>();
        gameSetting = stub<GameSetting>();

        roundHistoryStore = new RoundHistoryStore(roundTimeStoreMock, roundStoreMock, gameSetting);
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
   

    describe("get joinRoomHighLight", () => {
        test.each([
            [ROUND_STATE.SHOW_ANIMATION_RESULT, false],
            [ROUND_STATE.SHOW_RESULT, true],
            [ROUND_STATE.PLACING_BET, false],
            [ROUND_STATE.BEGIN_LOCKING_BET, false],
        ])("should return the correct value for roundState: %s", (roundState, expectedIsShowHighLight) => {
            roundTimeStoreMock.roundState = roundState;
            roundHistoryStore.histories = mockHistories;

            const result = roundHistoryStore.highLightInfo;

            expect(result.isHighLightAnim).toBe(expectedIsShowHighLight);
            expect(result.roundHistory).toEqual(roundHistoryStore.histories[0]);
        });
    });

    describe("updateHistories", () => {
        it("should update histories correctly when numberOfRoundHistory is greater than 0", () => {
            // Arrange
            gameSetting.numberOfRoundHistory = 3;
            const finish = {
                roundId: 1,
                result: {
                    red: true,
                },
                settlementResult: {
                    red: true,
                },
            };

            // Act
            roundHistoryStore.updateHistories(finish);

            // Assert
            expect(roundHistoryStore.histories).toEqual([finish]);
        });

        it("should update histories correctly when numberOfRoundHistory is 0", () => {
            // Arrange
            gameSetting.numberOfRoundHistory = 0;
            const finish = {
                roundId: 1,
                result: {
                    red: true,
                },
                settlementResult: {
                    red: true,
                },
            };

            // Act
            roundHistoryStore.updateHistories(finish);

            // Assert
            expect(roundHistoryStore.histories).toEqual([finish]);
        });
    });

    describe("updateHistories", () => {
        const initialHistories = [
            {
                roundId: 1,
                result: {
                    red: true,
                },
                settlementResult: {
                    red: true,
                },
            },
            {
                roundId: 2,
                result: {
                    red: true,
                },
                settlementResult: {
                    red: true,
                },
            },
        ];
        const finish = {
            roundId: 3,
            result: {
                red: true,
            },
            settlementResult: {
                red: true,
            },
        };

        beforeEach(() => {
            roundHistoryStore.histories = [...initialHistories];
            gameSetting.numberOfRoundHistory = 3;
        });

        it("should update histories correctly when numberOfRoundHistory is greater than the length of histories", () => {
            // Act
            roundHistoryStore.updateHistories(finish);

            // Assert
            expect(roundHistoryStore.histories).toEqual([finish, ...initialHistories]);
        });

        it("should update histories correctly when numberOfRoundHistory is less than or equal to the length of histories", () => {
            // Arrange
            gameSetting.numberOfRoundHistory = 2;

            // Act
            roundHistoryStore.updateHistories(finish);

            // Assert
            expect(roundHistoryStore.histories).toEqual([finish, ...initialHistories.slice(0, 2)]);
        });
    });
});
