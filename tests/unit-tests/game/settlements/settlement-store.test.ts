import { stub } from "jest-auto-stub";
import { makeAutoObservable } from "mobx";
import { SettlementStore } from "../../../../src/game/settlements";
import { GameServiceMessage } from "../../../../src/shared";

jest.mock("mobx");

describe("SettlementStore tests", () => {
    describe("constructor", () => {
        it("should call makeAutoObservable", () => {
            // act
            const store = new SettlementStore();

            // assert
            expect(makeAutoObservable).toHaveBeenCalledWith(store);
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
            finish.winningPlayers = {};

            // act
            store.setSettlementStore(finish);

            // assert
            expect(store.isFinishedShowResult).toBe(false);
            expect(store.roundId).toBe(1);
            expect(store.result).toEqual(result);
            expect(store.settlementResult).toEqual(settlementResult);
        });
    });

    describe("payChipInfo", () => {
        it("should return the finish info when isFinishedShowResult is true", () => {
            // Arrange
            const store = new SettlementStore();
            const mockWinningPlayers = {
                "1234": {
                    bet: 1,
                    rate: 2,
                    win: true,
                    winningByChoices: {
                        choice1: 2,
                    },
                },
            };
            const mockIsFinishedShowResult = true;
            const mockSettlementResult = {
                choice1: true,
            };
            store.isFinishedShowResult = mockIsFinishedShowResult;
            store.settlementResult = mockSettlementResult;
            store.winningPlayers = mockWinningPlayers;

            // Act
            const finishInfo = store.payChipInfo;

            // Assert
            expect(finishInfo).toEqual({
                settlementResult: mockSettlementResult,
                winningPlayers: mockWinningPlayers,
            });
        });

        it("should return null when isFinishedShowResult is false", () => {
            // ArrangeeMessage
            const store = new SettlementStore();
            store.isFinishedShowResult = false;

            // Act
            const finishInfo = store.payChipInfo;

            // Assert
            expect(finishInfo).toBeNull();
        });
    });

    describe("resetSettlementStore", () => {
        it("should reset winningPlayers and settlementResult to null", () => {
            // Act
            const settlementStore = new SettlementStore();
            settlementStore.winningPlayers = stub<GameServiceMessage.TWinningPlayers>();
            settlementStore.settlementResult = stub<GameServiceMessage.TSettlementResult>();

            // Arrange
            settlementStore.resetSettlementStore();

            // Assert
            expect(settlementStore.winningPlayers).toBeNull();
            expect(settlementStore.settlementResult).toBeNull();
        });

        it("should reset winningPlayers and settlementResult to null even if they are already null", () => {
            // Act
            const settlementStore = new SettlementStore();

            // Arrange
            settlementStore.resetSettlementStore();

            // Assert
            expect(settlementStore.winningPlayers).toBeNull();
            expect(settlementStore.settlementResult).toBeNull();
        });
    });
});
