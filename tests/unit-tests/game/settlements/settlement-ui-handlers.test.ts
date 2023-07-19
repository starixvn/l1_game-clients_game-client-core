import { stub } from "jest-auto-stub";
import { RoundHistoryStore } from "../../../../src/game/round-histories";
import { SettlementStore, SettlementUIHandlers } from "../../../../src/game/settlements";

describe("SettlementUIHandlers test", () => {
    let roundHistoryStore: RoundHistoryStore;
    let settlementStore: SettlementStore;
    let handler: SettlementUIHandlers.FinishedShowResult;
    beforeEach(() => {
        roundHistoryStore = stub<RoundHistoryStore>();
        settlementStore = stub<SettlementStore>();
        handler = new SettlementUIHandlers.FinishedShowResult(settlementStore, roundHistoryStore);
    });
    describe("FinishedShowResult", () => {
        it("should set finishedShowResult be qual true in settlementStore", () => {
            // arrange
            settlementStore.isFinishedShowResult = false;
            const handler = new SettlementUIHandlers.FinishedShowResult(settlementStore, roundHistoryStore);

            // act
            handler.handle();

            // assert
            expect(settlementStore.isFinishedShowResult).toBe(true);
        });

        describe("updateRounds", () => {
            it("should call setSettlementStore in settlementStore", () => {
                // arrange
                roundHistoryStore.updateHistories = jest.fn();
                settlementStore.isFinishedShowResult = true;

                // act
                handler.updateRounds();

                // assert
                expect(roundHistoryStore.updateHistories).toHaveBeenCalled();
            });
        });
    });
});
