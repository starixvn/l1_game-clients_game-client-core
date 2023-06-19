import { BetHistoryModel, BetHistoryStore } from "../../../../src/game/bet-history";

describe("BetHistoryStore tests", () => {
    let store: BetHistoryStore;

    beforeAll(() => {
        // arrange
        store = new BetHistoryStore();
    });

    describe("setData", () => {
        it("should set disabled value correctly", () => {
            const data: BetHistoryModel = {
                page: 1,
                pageSize: 8,
                total: 50,
                betLogs: [],
            };

            // act
            store.setData(data);

            // assert
            expect(store.data).toEqual(data);
        });
    });
});
