import { SettlementStatusStore, SettlementStore, SettlementUIHandlers } from "../../../../src/game/settlements";

describe("SettlementUIHandlers test", () => {
    describe("FinishedShowResult", () => {
        it("should set finishedShowResult be qual true in settlementStore", () => {
            // arrange
            const store = new SettlementStore();
            store.finishedShowResult = false;
            const handler = new SettlementUIHandlers.FinishedShowResult(store);

            // act
            handler.handle();

            // assert
            expect(store.finishedShowResult).toBe(true);
        });
    });

    describe("FinishedSettlement", () => {
        let settlementStore: SettlementStore;
        let settlementStatusStore: SettlementStatusStore;
        let handler: SettlementUIHandlers.FinishedSettlement;
        beforeEach(() => {
            settlementStore = new SettlementStore();
            settlementStatusStore = new SettlementStatusStore();
            handler = new SettlementUIHandlers.FinishedSettlement(settlementStore, settlementStatusStore);
        });
        it("should set finishedSettle true in SettlementStore", () => {
            // arrange
            settlementStore.finishedSettle = false;

            // act
            handler.handle();

            // assert
            expect(settlementStore.finishedSettle).toBe(true);
        });
        it("should call resetSettlementStatus in settlementStatusStore", () => {
            // arrange
            settlementStatusStore.resetSettlementStatus = jest.fn();

            // act
            handler.handle();

            // assert
            expect(settlementStatusStore.resetSettlementStatus).toHaveBeenCalled();
        });
    });
});
