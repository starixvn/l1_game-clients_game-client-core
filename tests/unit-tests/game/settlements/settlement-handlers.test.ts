import { stub } from "jest-auto-stub";
import { RoundHistoryStore } from "../../../../src/game/round-histories";
import { SettlementHandlers, SettlementStatusStore, SettlementStore } from "../../../../src/game/settlements";
import { GameServiceMessage } from "../../../../src/shared";

describe("SettlementHandlers tests", () => {
    let settlementStore: SettlementStore;
    let statusStore: SettlementStatusStore;
    let settlementHandlers: SettlementHandlers;
    let roundHistoryStore: RoundHistoryStore;
    beforeEach(() => {
        settlementStore = new SettlementStore();
        statusStore = new SettlementStatusStore();
        roundHistoryStore = stub<RoundHistoryStore>();
        settlementHandlers = new SettlementHandlers(settlementStore, statusStore, roundHistoryStore);
    });
    describe("handleFinish", () => {
        it("should call setSettlementStore in settlementStore", () => {
            // arrange
            settlementStore.setSettlementStore = jest.fn();
            roundHistoryStore.updateHistories = jest.fn();
            const finish = new GameServiceMessage.Finish();

            // act
            settlementHandlers.handleFinish(finish);

            // assert
            expect(settlementStore.setSettlementStore).toHaveBeenCalledWith(finish);
            expect(roundHistoryStore.updateHistories).toHaveBeenCalledWith(finish);
        });
    });

    describe("handleStatus", () => {
        it("should call setStatusStore in SettlementStatusStore", () => {
            // arrange
            statusStore.setStatusStore = jest.fn();
            const status = new GameServiceMessage.Status();

            // act
            settlementHandlers.handleStatus(status);

            // assert
            expect(statusStore.setStatusStore).toHaveBeenCalledWith(status);
        });
    });

    describe("eventHandleList", () => {
        it("should be equal expected", () => {
            // arrange
            const expected = [
                {
                    name: GameServiceMessage.Finish.eventName,
                    handle: settlementHandlers.handleFinish,
                },
                {
                    name: GameServiceMessage.Status.eventName,
                    handle: settlementHandlers.handleStatus,
                },
            ];

            // assert
            expect(settlementHandlers.eventHandleList).toEqual(expected);
        });
    });
});
