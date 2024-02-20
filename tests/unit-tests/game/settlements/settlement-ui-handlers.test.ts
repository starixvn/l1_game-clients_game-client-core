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
        let settlementStore: SettlementStore;
        let roundHistoryStore: RoundHistoryStore;
        let handler: SettlementUIHandlers.FinishedShowResult;
        beforeEach(() => {
            settlementStore = stub<SettlementStore>();
            roundHistoryStore = stub<RoundHistoryStore>();
            handler = new SettlementUIHandlers.FinishedShowResult(settlementStore, roundHistoryStore);
        });
        it("should set finishedShowResult be qual true in settlementStore", () => {
            // arrange
            settlementStore.isFinishedShowResult = false;

            // act
            handler.handle();

            // assert
            expect(settlementStore.isFinishedShowResult).toBe(true);
        });

        it("should updateHistories in roundHistoryStore", () => {
            // arrange
            const { roundId, result, settlementResult, md5Result, pf } = settlementStore;
            // act
            handler.handle();

            // assert
            expect(roundHistoryStore.updateHistories).toHaveBeenCalledWith({ roundId, result, settlementResult, md5Result, pf });
        });
    });
});
