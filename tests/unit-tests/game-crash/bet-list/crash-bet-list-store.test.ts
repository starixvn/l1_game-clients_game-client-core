import { CrashBetListStore } from "../../../../src/game-crash/bet-list/crash-bet-list-store";

describe("CrashBetListStore", () => {
    let crashBetListStore: CrashBetListStore;

    beforeEach(() => {
        crashBetListStore = new CrashBetListStore();
    });

    describe("groupPlayersByName", () => {
        it("when players have groups", () => {
            //Arrange
            const playerList = [
                { playerId: "123", name: "abc", amount: 5, win: 12.5, multiplier: 2.5 },
                { playerId: "123", name: "abc", amount: 5, win: 15.5, multiplier: 2.8 },
                { playerId: "456", name: "cde", amount: 10, win: 30, multiplier: 3 },
                { playerId: "789", name: "dcf", amount: 10, win: 20, multiplier: 2 },
            ];

            //Act
            const result = crashBetListStore["groupPlayersByName"](playerList);

            //Assert
            expect(result).toEqual(3);
        });
    });

    describe("noOfPlayerBet", () => {
        it("when have main player", () => {
            //Arrange
            crashBetListStore.mainPlayer = { playerId: "123", name: "abc", amount: 5, win: 12.5 };
            crashBetListStore["groupPlayersByName"] = jest.fn(() => 3);

            //Act

            //Assert
            expect(crashBetListStore.noOfPlayerBet).toEqual(4);
        });

        // it("when have not main player", () => {
        //     //Arrange
        //     crashBetListStore["groupPlayersByName"] = jest.fn(() => 3);
        //     crashBetListStore.mainPlayer = {};

        //     //Assert
        //     expect(crashBetListStore.noOfPlayerBet).toEqual(3);
        // });
    });

    describe("noOfPlayerCashOut", () => {
        beforeEach(() => {
            crashBetListStore.otherPlayers = [
                { playerId: "123", name: "abc", amount: 5, win: 12.5, multiplier: 2.5 },
                { playerId: "234", name: "acf", amount: 5, win: 12.5, multiplier: 2.5 },
            ];
        });
        it("when main player has cash out", () => {
            //Arrange
            crashBetListStore.mainPlayer = {
                playerId: "123",
                name: "abc",
                amount: 5,
                win: 12.5,
                cashOut: { amount: 5, win: 12.5, multiplier: 2.5 },
            };

            //Act

            //Assert
            expect(crashBetListStore.noOfPlayerCashOut).toEqual(3);
        });

        it("when main player has not cash out", () => {
            //Arrange
            crashBetListStore.mainPlayer = {
                playerId: "123",
                name: "abc",
                amount: 5,
                win: 12.5,
            };

            //Act

            //Assert
            expect(crashBetListStore.noOfPlayerCashOut).toEqual(2);
        });
    });

    describe("totalCashOut", () => {
        beforeEach(() => {
            crashBetListStore.otherPlayers = [
                { playerId: "123", name: "abc", amount: 5, win: 12.5, multiplier: 2.5 },
                { playerId: "234", name: "acf", amount: 5, win: 12.5, multiplier: 2.5 },
            ];
        });
        it("when main player has cashed out", () => {
            //Arrange
            crashBetListStore.mainPlayer = {
                playerId: "123",
                name: "abc",
                amount: 5,
                win: 12.5,
                cashOut: { amount: 5, win: 12.5, multiplier: 2.5 },
            };

            //Act

            //Assert
            expect(crashBetListStore.totalCashOut).toEqual(37.5);
        });

        it("when main player has cashed out and half cashed out", () => {
            //Arrange
            crashBetListStore.mainPlayer = {
                playerId: "123",
                name: "abc",
                amount: 5,
                win: 12.5,
                cashOut: { amount: 5, win: 12.5, multiplier: 2.5 },
                halfCashOut: { amount: 2.5, win: 6.5, multiplier: 1.5 },
            };

            //Act

            //Assert
            expect(crashBetListStore.totalCashOut).toEqual(44);
        });
    });
});
