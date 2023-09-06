import { stub } from "jest-auto-stub";
import { when } from "mobx";
import { GameSetting } from "../../../../src/game/game-configs";
import { RoundHistory, RoundHistoryStore } from "../../../../src/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "../../../../src/game/rounds";
import { SettlementStore } from "../../../../src/game/settlements/settlement-store";

jest.mock("mobx");

describe("RoundHistoryStore", () => {
    let roundHistoryStore: RoundHistoryStore;
    let roundTimeStoreMock: RoundTimeStore;
    let mockHistories: RoundHistory[];
    let gameSetting: GameSetting;
    let settlementStore: SettlementStore;

    beforeEach(() => {
        roundTimeStoreMock = stub<RoundTimeStore>();
        gameSetting = stub<GameSetting>();
        settlementStore = stub<SettlementStore>();

        roundHistoryStore = new RoundHistoryStore(roundTimeStoreMock, gameSetting, settlementStore);
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

        it("roundHistoryStore.histories = 0 when numberOfRoundHistory is 0", () => {
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
            expect(roundHistoryStore.histories).toEqual([]);
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
            expect(roundHistoryStore.histories.length).toBe(gameSetting.numberOfRoundHistory);
            expect(roundHistoryStore.histories).toEqual([finish, initialHistories[0]]);
        });
    });

    describe("shouldShowResultWhenJoinGame", () => {
        test.each`
            roundState                           | histories                                                | currentFinish | expected
            ${ROUND_STATE.SHOW_ANIMATION_RESULT} | ${[{ id: 1, result: "Win" }, { id: 2, result: "Lose" }]} | ${null}       | ${true}
            ${ROUND_STATE.SHOW_RESULT}           | ${[{ id: 3, result: "Draw" }, { id: 4, result: "Win" }]} | ${null}       | ${true}
            ${ROUND_STATE.LOCKING_BET}           | ${[{ id: 5, result: "Lose" }, { id: 6, result: "Win" }]} | ${{}}         | ${false}
        `(
            "returns $expected when roundState is $roundState and histories are $histories",
            ({ roundState, histories, currentFinish, expected }) => {
                // Arrange
                settlementStore = stub<SettlementStore>({ currentFinish });
                roundHistoryStore = new RoundHistoryStore(roundTimeStoreMock, gameSetting, settlementStore);

                roundHistoryStore.histories = histories;
                roundTimeStoreMock.roundState = roundState;
                roundHistoryStore.joinGameHistory = expected;

                // Act
                const result = roundHistoryStore.isShowResultWhenJoinGame();

                // Assert
                expect(result).toEqual(expected);
            }
        );
    });

    it("should call mobx.when with the expected conditions", () => {
        // Act
        roundHistoryStore.isValidHistories = jest.fn(() => true);

        // Assert
        expect(when).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
    });
});
