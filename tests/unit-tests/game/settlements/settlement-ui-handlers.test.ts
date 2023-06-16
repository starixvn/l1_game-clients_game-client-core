import { SettlementStore, SettlementUIHandlers } from "../../../../src/game/settlements";

describe("SettlementUIHandlers test", () => {
    describe("FinishedShowResult", () => {
        it("should set finishedShowResult be qual true in settlementStore", () => {
            // arrange
            const store = new SettlementStore();
            store.isFinishedShowResult = false;
            const handler = new SettlementUIHandlers.FinishedShowResult(store);

            // act
            handler.handle();

            // assert
            expect(store.isFinishedShowResult).toBe(true);
        });
    });
});
