import { makeAutoObservable } from "mobx";
import { SettlementStatusStore } from "../../../../src/game/settlements";
import { GameServiceMessage } from "../../../../src/shared";

jest.mock("mobx");
describe("SettlementStatusStore test", () => {
    describe("constructor", () => {
        it("should call makeAutoObservable", () => {
            // act
            const store = new SettlementStatusStore();

            // assert
            expect(makeAutoObservable).toHaveBeenCalledWith(store);
        });
    });

    describe("setStatusStore", () => {
        it("should set the status store", () => {
            // arrange
            const store = new SettlementStatusStore();
            const status = new GameServiceMessage.Status();
            status.win = true;
            status.bet = 10;
            status.winningByChoices = { odd: 10 };

            // act
            store.setStatusStore(status);

            // assert
            expect(store.win).toBe(true);
            expect(store.bet).toBe(10);
            expect(store.winningByChoices).toEqual({ odd: 10 });
        });
    });

    describe("resetSettlementStatus", () => {
        it("should set win false and bet 0", () => {
            // arrange
            const store = new SettlementStatusStore();
            store.win = true;
            store.bet = 10;

            // act
            store.resetSettlementStatus();

            // assert
            expect(store.win).toBe(false);
            expect(store.bet).toBe(0);
        });
    });

    describe("settlementStatus()", () => {
        it("should return a valid settlement status object", () => {
            // Arrange
            const store = new SettlementStatusStore();
            const mockStatus = {
                win: true,
                bet: 50,
                winningByChoices: {
                    choice1: 30,
                    choice2: 20,
                },
            };
            store.setStatusStore(mockStatus);

            // Act
            const settlementStatus = store.settlementStatus;

            // Assert
            expect(settlementStatus).toEqual({
                win: true,
                bet: 50,
                winningByChoices: {
                    choice1: 30,
                    choice2: 20,
                },
            });
        });
    });
});
