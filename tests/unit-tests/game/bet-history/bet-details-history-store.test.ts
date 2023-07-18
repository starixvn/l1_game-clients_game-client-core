import { BetDetailHitoryStore, BetHistoryLog } from "../../../../src/game/bet-history";
import { MainPlayerStore } from "../../../../src/players";

describe("BetDetailHitoryStore tests", () => {
    let store: BetDetailHitoryStore;
    const mainPlayerStore = new MainPlayerStore();
    mainPlayerStore.fractionalOddsFormat = false;

    beforeAll(() => {
        // arrange
        store = new BetDetailHitoryStore(mainPlayerStore);
    });

    describe("setData", () => {
        it("should set disabled value correctly", () => {
            const betHistoryLog: BetHistoryLog = {
                freeBet: false,
                roundId: 29707,
                win: 19,
                betwin: 19,
                odds: {
                    dragon: 1.9,
                    tiger: 1.9,
                    tie: 1.9,
                    redDragon: 1.65,
                    blackDragon: 1.65,
                    redTiger: 1.65,
                    blackTiger: 1.65,
                },

                time: "2023-07-10T08:39:26.350Z",
                totalAmount: 31,
                result: {
                    dragon: {
                        rank: 0,
                        suit: 1,
                    },
                    tiger: {
                        rank: 7,
                        suit: 2,
                    },
                },
                settlementResult: {
                    dragon: false,
                    tiger: true,
                    tie: false,
                    blackDragon: false,
                    redDragon: true,
                    blackTiger: true,
                    redTiger: false,
                },
                betLogDetails: [
                    {
                        amount: 5,
                        rebet: false,
                        time: "2023-07-10T08:39:31.236Z",
                        choice: "blackDragon",
                        rate: 1,
                    },
                    {
                        amount: 5,
                        rebet: false,
                        time: "2023-07-10T08:39:30.490Z",
                        choice: "redTiger",
                        rate: 1,
                    },
                ],
            };

            // act
            store.setData(betHistoryLog);

            // assert
            expect(store.model).toEqual({ fractionalOddsFormat: false, betHistoryLog });
        });
    });
});
