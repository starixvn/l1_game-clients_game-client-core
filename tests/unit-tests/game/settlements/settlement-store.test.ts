import { action, makeObservable, observable } from "mobx";
import { SettlementStore } from "../../../../src/game/settlements";
import { GameServiceMessage } from "../../../../src/shared";

jest.mock("mobx");

describe("SettlementStore tests", () => {
    describe("constructor", () => {
        it("should call makeObservable", () => {
            // act
            const store = new SettlementStore();

            // assert
            expect(makeObservable).toHaveBeenCalledWith(store, {
                roundId: observable,
                result: observable,
                settlementResult: observable,
                finishedShowResult: observable,
                setSettlementStore: action,
            });
        });
    });
    describe("setSettlementStore", () => {
        it("should set settlement store", () => {
            // arrange
            const store = new SettlementStore();
            const finish = new GameServiceMessage.Finish();
            finish.roundId = 1;
            const result = { red1: false, red2: true, red3: true, red4: true };
            finish.result = result;
            const settlementResult = { odd: true, even: false, red2: false, red3: true, red4: false, white3: false, white4: false };
            finish.settlementResult = settlementResult;

            // act
            store.setSettlementStore(finish);

            // assert
            expect(store.finishedShowResult).toBe(false);
            expect(store.finishedSettle).toBe(false);
            expect(store.roundId).toBe(1);
            expect(store.result).toEqual(result);
            expect(store.settlementResult).toEqual(settlementResult);
        });
    });
});
