import { stub } from "jest-auto-stub";
import { CrashBetListHandlers } from "../../../../src/game-crash/bet-list/crash-bet-list-handlers";
import { OtherPlayerHandlers } from "../../../../src/game-crash/other-player/other-player-handlers";
import { OtherPlayerStore } from "../../../../src/game-crash/other-player/other-player-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";

describe("OtherPlayerHandlers", () => {
    let otherPlayerHandlers: OtherPlayerHandlers;
    let mainPlayerStore: MainPlayerStore;
    let otherPlayerStore: OtherPlayerStore;
    let betListHandler: CrashBetListHandlers;

    beforeAll(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        otherPlayerStore = stub<OtherPlayerStore>();
        betListHandler = stub<CrashBetListHandlers>();
    });

    beforeEach(() => {
        otherPlayerHandlers = new OtherPlayerHandlers(mainPlayerStore, otherPlayerStore, betListHandler);
    });

    describe("handle", () => {
        it("test handle", () => {
            const otherPlayer = {
                name: "abc",
                amount: 100,
                win: 150,
                cashOut: {
                    amount: 50,
                    win: 54.5,
                    cashOutWin: 54.5,
                    multiplier: 1.09,
                    reachMaxWin: false,
                },
            };
            otherPlayerHandlers.convertCurrencyCashOut = jest.fn();

            //Act
            otherPlayerHandlers.handle(otherPlayer);

            //Assert
            expect(betListHandler.handleNewOtherCashOut).toBeCalled();
        });
        //Arrange
    });

    describe("convertCurrencyCashOut", () => {
        it("when otherPlayer has cashOut", () => {
            //Arrange
            const otherPlayer = {
                name: "abc",
                amount: 100,
                win: 150,
                rate: 1.5,
                cashOut: {
                    amount: 50,
                    win: 54.5,
                    cashOutWin: 54.5,
                    multiplier: 1.09,
                    reachMaxWin: false,
                },
            };
            betListHandler.convertAmountAndWinValue = jest.fn();

            //Act
            otherPlayerHandlers.convertCurrencyCashOut(otherPlayer);

            //Assert
            expect(betListHandler.convertAmountAndWinValue).toBeCalledTimes(1);
        });

        it("when otherPlayer has cashOut and halfCashOut", () => {
            //Arrange
            const otherPlayer = {
                name: "abc",
                amount: 100,
                win: 150,
                rate: 1.5,
                cashOut: {
                    amount: 50,
                    win: 54.5,
                    cashOutWin: 54.5,
                    multiplier: 1.09,
                    reachMaxWin: false,
                },
                halfCashOut: {
                    amount: 50,
                    win: 54.5,
                    cashOutWin: 54.5,
                    multiplier: 1.09,
                    reachMaxWin: false,
                },
            };
            betListHandler.convertAmountAndWinValue = jest.fn();

            //Act
            otherPlayerHandlers.convertCurrencyCashOut(otherPlayer);

            //Assert
            expect(betListHandler.convertAmountAndWinValue).toBeCalledTimes(2);
        });
    });
});
