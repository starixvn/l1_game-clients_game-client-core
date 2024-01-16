import { stub } from "jest-auto-stub";

import { CrashBetListHandlers } from "../../../../src/game-crash/bet-list/crash-bet-list-handlers";
import { CrashBetListStore, ICrashBetList } from "../../../../src/game-crash/bet-list/crash-bet-list-store";
import { CrashCashOutStore } from "../../../../src/game-crash/cash-out/crash-cash-out-store";
import { GameCrashServiceMessage, LeaderBoardPlayer } from "../../../../src/game-crash/game-crash-messages";
import { BetStore } from "../../../../src/game/bets/bet-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";
import { GameServiceMessage } from "../../../../src/shared/models/game-messages";
import { NumberUtils } from "../../../../src/shared/utils/number-utils";
describe("CrashBetListHandlers", () => {
    let betListHandlers: CrashBetListHandlers;
    let mainPlayerStore: MainPlayerStore;
    let crashCashOutStore: CrashCashOutStore;
    let roundTimeStore: RoundTimeStore;
    let betStore: BetStore;
    let betListStore: CrashBetListStore;
    const mockedConvertedCurrencyValue = 100;

    const halfCashOut = {
        amount: 25,
        win: 26.25,
        cashOutWin: 26.25,
        multiplier: 1.05,
        reachMaxWin: false,
    };

    const cashOut = {
        amount: 50,
        win: 54.5,
        cashOutWin: 54.5,
        multiplier: 1.09,
        reachMaxWin: false,
    };

    const player1 = {
        playerId: "1e6aa437bdcc701b8ca8f7a4",
        name: "user1",
        amount: 50,
        red: 3177.360000000093,
        rate: 1,
    };

    const player2 = {
        playerId: "5e7aa437bdcc701b8ca8f7a4",
        name: "ChoiChoy",
        amount: mockedConvertedCurrencyValue,
        red: 3177.360000000093,
        rate: 1,
    };

    const player3HalfCashOut = {
        time: "2024-01-08T07:43:55.957Z",
        playerId: "5e7aa462bdcc701b8ca8f9fe",
        name: "QuatKeat",
        amount: 50,
        rate: 1,
        halfCashOut: {
            amount: 25,
            win: 39.5,
            multiplier: 1.58,
            cashOutWin: 39.5,
            reachMaxWin: false,
        },
    };

    const player4 = {
        time: "2024-01-08T07:43:56.437Z",
        playerId: "5e7b00dded38634d3865f8c0",
        name: "Akane",
        amount: 50,
        rate: 1,
    };

    const player4CashOut = {
        time: "2024-01-08T07:43:56.437Z",
        playerId: "5e7b00dded38634d3865f8c0",
        name: "Akane",
        amount: 50,
        rate: 1,
        cashOut: {
            amount: 50,
            win: 75.5,
            multiplier: 1.51,
            cashOutWin: 75.5,
            reachMaxWin: false,
        },
    };

    const player5 = {
        playerId: "4e6aa437bdcc701b8ca8f7a4",
        name: "User5",
        amount: 10,
        red: 3177.360000000093,
        rate: 1,
    };

    const mockedConvertedCurrencyPlayer5 = {
        playerId: "4e6aa437bdcc701b8ca8f7a4",
        name: "User5",
        amount: mockedConvertedCurrencyValue,
        red: 3177.360000000093,
        rate: 1,
    };

    const player6CashOut = {
        playerId: "1d4aa537bdcc701b8ca8f7a4",
        name: "User6",
        amount: 10,
        red: 3177.360000000093,
        rate: 1,
        cashOut: {
            amount: 50,
            win: mockedConvertedCurrencyValue,
            multiplier: 1.51,
            cashOutWin: 75.5,
            reachMaxWin: false,
        },
    };

    beforeAll(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        crashCashOutStore = stub<CrashCashOutStore>();
        roundTimeStore = stub<RoundTimeStore>();
        betStore = stub<BetStore>();
        betListStore = stub<CrashBetListStore>();
    });

    beforeEach(() => {
        betListHandlers = new CrashBetListHandlers(mainPlayerStore, crashCashOutStore, roundTimeStore, betStore, betListStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("reactionStartRound", () => {
        beforeEach(() => {
            // Arrange
            betListHandlers["resetLeaderBoard"] = jest.fn();
        });

        describe("when placing bet", () => {
            const isStartPlacingBet = true;

            it("should call resetLeaderBoard()", () => {
                // Act
                betListHandlers["reactionStartRound"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetLeaderBoard"]).toBeCalled();
            });
        });
        describe("when not placing bet", () => {
            const isStartPlacingBet = false;

            it("should not call resetLeaderBoard()", () => {
                // Act
                betListHandlers["reactionStartRound"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetLeaderBoard"]).not.toBeCalled();
            });
        });
    });

    describe("reactionLastReceivedBet", () => {
        describe("when lastReceivedBet is null", () => {
            it("should not update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = null;
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet as any);

                // Assert
                expect(betListStore.mainPlayer).toEqual(null);
            });
        });

        describe("when lastReceivedBet has data, but a bet value is less than 0", () => {
            it("should not update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = { value: -1, isAnimated: false };
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet as any);

                // Assert
                expect(betListStore.mainPlayer).toEqual(null);
            });
        });

        describe("when lastReceivedBet has data and a bet value is greater than 0", () => {
            it("should update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = { value: 1, isAnimated: false };
                Object.defineProperty(mainPlayerStore, "name", { value: "user1", configurable: true, writable: true });
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });
                const expectedData = { name: "user1", amount: lastReceivedBet.value };

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(expectedData);
            });
        });
    });

    describe("reactionHalfCashOut", () => {
        describe("when halfCashOut is null", () => {
            it("should not update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const halfCashOut = null;
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](halfCashOut as any);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(null);
            });
        });
        describe("when halfCashOut has data", () => {
            beforeEach(() => {
                // Arrange
                Object.defineProperty(betListStore, "mainPlayer", {
                    value: { name: "user1", amount: 10 },
                    configurable: true,
                    writable: true,
                });
            });

            it("should update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const { name, amount } = betListHandlers["betListStore"].mainPlayer;
                const expectedData = { name, amount, halfCashOut };

                // Act
                betListHandlers["reactionHalfCashOut"](halfCashOut);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(expectedData);
            });
        });
    });

    describe("reactionCashOut", () => {
        describe("when cashOut is null", () => {
            const cashOut = null;

            beforeEach(() => {
                // Arrange
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });
            });

            it("should not update mainPlayer of CrashBetListStore", () => {
                // Arrange

                // Act
                betListHandlers["reactionCashOut"](cashOut as any);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(null);
            });
        });
        describe("when cashOut has data", () => {
            beforeEach(() => {
                // Arrange
                Object.defineProperty(betListStore, "mainPlayer", {
                    value: { name: "user1", amount: 10, halfCashOut },
                    configurable: true,
                    writable: true,
                });
            });

            it("should update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const { name, amount } = betListStore.mainPlayer;
                const expectedData = { name, amount, halfCashOut, cashOut };

                // Act
                betListHandlers["reactionCashOut"](cashOut);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(expectedData);
            });
        });
    });

    describe("sortByMultiplierBetAmount", () => {
        let players: LeaderBoardPlayer[] = [];
        let expectedData: LeaderBoardPlayer[] = [];

        beforeEach(() => {
            // Arrange
            const player1 = stub<LeaderBoardPlayer>({ amount: 15, win: 0, multiplier: 0 });
            const player2 = stub<LeaderBoardPlayer>({ amount: 20, win: 0, multiplier: 0 });
            const player3 = stub<LeaderBoardPlayer>({ amount: 10, multiplier: 2.0, win: 4.0 });
            const player4 = stub<LeaderBoardPlayer>({ amount: 10, multiplier: 1.23, win: 3.0 });

            players = [player1, player2, player3, player4];
            expectedData = [player3, player4, player2, player1];
        });

        it("should call sortPlayersByMultiplier()", () => {
            // Arrange
            const spySortPlayersByMultiplier = jest.spyOn(betListHandlers as any, "sortPlayersByMultiplier");

            // Act
            betListHandlers["sortByMultiplierBetAmount"](players);

            // Assert
            expect(spySortPlayersByMultiplier).toBeCalled();
        });

        it("should call sortPlayersByBetAmount()", () => {
            // Arrange
            const spySortPlayersByBetAmount = jest.spyOn(betListHandlers as any, "sortPlayersByBetAmount");

            // Act
            betListHandlers["sortByMultiplierBetAmount"](players);

            // Assert
            expect(spySortPlayersByBetAmount).toBeCalled();
        });

        it("should return array sort by multiplier for win, then sort by amount for not cashout", () => {
            // Arrange

            // Act
            const result = betListHandlers["sortByMultiplierBetAmount"](players);

            // Assert
            result.forEach((item, index) => {
                expect(item.amount).toEqual(expectedData[index].amount);
            });
        });
    });

    describe("sortPlayersByBetAmount", () => {
        const players: LeaderBoardPlayer[] = [];
        const expectedData: LeaderBoardPlayer[] = [];

        beforeEach(() => {
            // Arrange
            const player1 = stub<LeaderBoardPlayer>({ amount: 10, multiplier: 0 });
            const player2 = stub<LeaderBoardPlayer>({ amount: 20, multiplier: 0 });
            players.push(...[player1, player2]);
            expectedData.push(...[player2, player1]);
            betListHandlers["sortDecreasedBetAmount"] = jest.fn(() => expectedData);
        });

        it("should call sortDecreasedBetAmount()", () => {
            // Arrange

            // Act
            betListHandlers["sortPlayersByBetAmount"](players);

            // Assert
            expect(betListHandlers["sortDecreasedBetAmount"]).toBeCalled();
        });

        it("should return decreased player list by bet amount", () => {
            // Arrange

            // Act
            const newPlayers = betListHandlers["sortPlayersByBetAmount"](players);

            // Assert
            expect(newPlayers).toEqual(expectedData);
        });
    });

    describe("playerHasCashedOut", () => {
        it("should return true when multiplier > 0", () => {
            // Arrange
            const player = stub<LeaderBoardPlayer>({ multiplier: 2 });
            // Act
            const result = betListHandlers["playerHasCashedOut"](player);
            // Assert
            expect(result).toEqual(true);
        });

        it("should return false when multiplier = 0", () => {
            // Arrange
            const player = stub<LeaderBoardPlayer>({ multiplier: 0 });
            // Act
            const result = betListHandlers["playerHasCashedOut"](player);
            // Assert
            expect(result).toEqual(false);
        });
        it("should return false when multiplier < 0", () => {
            // Arrange
            const player = stub<LeaderBoardPlayer>({ multiplier: -1 });
            // Act
            const result = betListHandlers["playerHasCashedOut"](player);
            // Assert
            expect(result).toEqual(false);
        });
    });

    describe("convertAmountAndWinValue", () => {
        it("should convert for win and amount value", () => {
            // Arrange
            const amount = 10;
            const win = 20;
            const cashOut = stub<GameCrashServiceMessage.CashOutReceive>({ amount, win });
            const rate = 1.5;
            const mainRate = 1.2;
            Object.defineProperty(mainPlayerStore, "rate", { value: mainRate, configurable: true, writable: true });
            const expectedWin = NumberUtils.getValueByCurrency(win, mainRate, rate);
            const expectedAmount = NumberUtils.getValueByCurrency(amount, mainRate, rate);
            // Act
            betListHandlers["convertAmountAndWinValue"](cashOut, rate);
            // Assert
            expect(cashOut.win).toEqual(expectedWin);
            expect(cashOut.amount).toEqual(expectedAmount);
        });
    });

    describe("resetLeaderBoard", () => {
        it("should set bet list to empty array", () => {
            // Arrange

            // Act
            betListHandlers["resetOtherPlayerList"]();

            // Assert
            expect(betListStore.otherPlayers.length).toEqual(0);
        });

        it("should set main player to null", () => {
            // Arrange

            // Act
            betListHandlers["resetMainPlayer"]();

            // Assert
            expect(betListStore.mainPlayer).toEqual(null);
        });
    });

    describe("updateCashOutRow", () => {
        it("should update amount, win, multiplier", () => {
            // Arrange
            const notCashedOutRow = stub<LeaderBoardPlayer>({ playerId: "1", name: "abc", amount: 100, win: 0, multiplier: 0 });
            const cashOut = stub<GameCrashServiceMessage.CashOutReceive>({ amount: 100, win: 200, multiplier: 2.0 });

            // Act
            betListHandlers["updateCashOutRow"](notCashedOutRow, cashOut);

            // Assert
            expect(notCashedOutRow.amount).toEqual(cashOut.amount);
            expect(notCashedOutRow.win).toEqual(cashOut.win);
            expect(notCashedOutRow.multiplier).toEqual(cashOut.multiplier);
        });
    });

    describe("updateAmountAndAddHalfCashOut", () => {
        let notCashedOutRow;
        let halfCashOut;
        beforeEach(() => {
            betListHandlers["createHalfCashOut"] = jest.fn();
            notCashedOutRow = stub<LeaderBoardPlayer>({ playerId: "1", name: "abc", amount: 100, win: 0, multiplier: 0 });
            halfCashOut = stub<GameCrashServiceMessage.CashOutReceive>({ amount: 50, win: 100, multiplier: 2.0 });
        });
        it("should update notCashedOutRow amount by halfCashOut amount", () => {
            // Arrange

            // Act
            betListHandlers["updateAmountAndAddHalfCashOut"](notCashedOutRow, halfCashOut);

            // Assert
            expect(notCashedOutRow.amount).toEqual(halfCashOut.amount);
        });

        it("should call createHalfCashOut", () => {
            // Arrange

            // Act
            betListHandlers["updateAmountAndAddHalfCashOut"](notCashedOutRow, halfCashOut);

            // Assert
            expect(betListHandlers["createHalfCashOut"]).toBeCalled();
        });
    });

    describe("createHalfCashOut", () => {
        it("should clone current row, then fill value from cashout", () => {
            // Arrange
            const notCashedOutRow = stub<LeaderBoardPlayer>({ playerId: "1", name: "abc", amount: 100, win: 0, multiplier: 0 });
            const halfCashOut = stub<GameCrashServiceMessage.CashOutReceive>({ amount: 50, win: 100, multiplier: 2.0 });

            // Act
            const result = betListHandlers["createHalfCashOut"](notCashedOutRow, halfCashOut);

            // Assert
            expect(result.playerId).toEqual(notCashedOutRow.playerId);
            expect(result.name).toEqual(notCashedOutRow.name);

            expect(result.amount).toEqual(halfCashOut.amount);
            expect(result.win).toEqual(halfCashOut.win);
            expect(result.multiplier).toEqual(halfCashOut.multiplier);
        });
    });

    describe("handleBetList", () => {
        let betList: ICrashBetList;
        let initOtherPlayers;

        beforeEach(() => {
            betList = stub<ICrashBetList>();
            betListHandlers["generateLeaderBoardPlayers"] = jest.fn();
            betListHandlers["sortByMultiplierBetAmount"] = jest.fn();
            initOtherPlayers = [];
            Object.defineProperty(betListStore, "otherPlayers", { value: initOtherPlayers, configurable: true, writable: true });
        });

        it("should call generateLeaderBoardPlayers()", () => {
            // Arrange

            // Act
            betListHandlers["handleBetList"](betList);

            // Assert
            expect(betListHandlers["generateLeaderBoardPlayers"]).toBeCalled();
        });

        it("should call sortByMultiplierBetAmount()", () => {
            // Arrange

            // Act
            betListHandlers["handleBetList"](betList);

            // Assert
            expect(betListHandlers["sortByMultiplierBetAmount"]).toBeCalled();
        });

        it("should return otherPlayers by new array", () => {
            // Arrange

            // Act
            betListHandlers["handleBetList"](betList);

            // Assert
            expect(betListStore["otherPlayers"]).not.toBe(initOtherPlayers);
        });
    });

    describe("convertCurrencyForPlayerChip", () => {
        it("should convert for amount value", () => {
            // Arrange
            const amount = 10;
            const rate = 1.5;
            const mainRate = 1.2;
            const playerChip = stub<GameServiceMessage.PlayerChip>({ amount, rate });
            Object.defineProperty(mainPlayerStore, "rate", { value: mainRate, configurable: true, writable: true });
            const expectedAmount = NumberUtils.getValueByCurrency(amount, mainRate, rate);
            // Act
            const result = betListHandlers["convertCurrencyForPlayerChip"](playerChip);
            // Assert
            expect(result.amount).toEqual(expectedAmount);
        });
    });

    describe("handlePlayerChip", () => {
        let playerChip: GameServiceMessage.PlayerChip;
        let initOtherPlayers = [];

        beforeEach(() => {
            // Arrange
            playerChip = stub<GameServiceMessage.PlayerChip>();
            betListHandlers["sortPlayersByBetAmount"] = jest.fn();
            betListHandlers["convertCurrencyForPlayerChip"] = jest.fn();

            initOtherPlayers = [];
            Object.defineProperty(betListStore, "otherPlayers", { value: initOtherPlayers, configurable: true, writable: true });
        });

        it("should call convertCurrencyForPlayerChip()", () => {
            // Arrange

            // Act
            betListHandlers["handlePlayerChip"](playerChip);

            // Assert
            expect(betListHandlers["convertCurrencyForPlayerChip"]).toBeCalled();
        });

        it("should call sortPlayersByBetAmount()", () => {
            // Arrange

            // Act
            betListHandlers["handlePlayerChip"](playerChip);

            // Assert
            expect(betListHandlers["sortPlayersByBetAmount"]).toBeCalled();
        });

        it("should return otherPlayers by new array", () => {
            // Arrange

            // Act
            betListHandlers["handlePlayerChip"](playerChip);

            // Assert
            expect(betListStore["otherPlayers"]).not.toBe(initOtherPlayers);
        });
    });

    describe("handleNewOtherCashOut", () => {
        let otherPlayer: GameCrashServiceMessage.CrashOtherPlayer;
        let initOtherPlayers: LeaderBoardPlayer[] = [];
        const playerId = "123";

        beforeEach(() => {
            // Arrange
            otherPlayer = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                playerId,
            });
            betListHandlers["updateAmountAndAddHalfCashOut"] = jest.fn();
            betListHandlers["updateCashOutRow"] = jest.fn();
            betListHandlers["sortByMultiplierBetAmount"] = jest.fn();
        });

        describe("NOT exist player not cashed out", () => {
            it("should NOT call sortByMultiplierBetAmount()", () => {
                // Arrange
                const player = stub<LeaderBoardPlayer>({ playerId, multiplier: 2.0 });
                initOtherPlayers = [player];
                Object.defineProperty(betListStore, "otherPlayers", { value: initOtherPlayers, configurable: true, writable: true });

                // Act
                betListHandlers["handleNewOtherCashOut"](otherPlayer);

                // Assert
                expect(betListHandlers["sortByMultiplierBetAmount"]).not.toBeCalled();
            });
        });
        describe("exist player not cashed out", () => {
            beforeEach(() => {
                const player = stub<LeaderBoardPlayer>({ playerId, multiplier: 0 });
                initOtherPlayers = [player];
                Object.defineProperty(betListStore, "otherPlayers", { value: initOtherPlayers, configurable: true, writable: true });
            });
            it("should call sortByMultiplierBetAmount()", () => {
                // Arrange

                // Act
                betListHandlers["handleNewOtherCashOut"](otherPlayer);

                // Assert
                expect(betListHandlers["sortByMultiplierBetAmount"]).toBeCalled();
            });

            it("should return otherPlayers by new array", () => {
                // Arrange

                // Act
                betListHandlers["handleNewOtherCashOut"](otherPlayer);

                // Assert
                expect(betListStore["otherPlayers"]).not.toBe(initOtherPlayers);
            });

            describe("otherPlayer has only halfCashOut", () => {
                beforeEach(() => {
                    // Arrange
                    otherPlayer = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                        playerId,
                        halfCashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                        cashOut: undefined,
                    });
                });
                it("should call updateAmountAndAddHalfCashOut()", () => {
                    // Act
                    betListHandlers["handleNewOtherCashOut"](otherPlayer);

                    // Assert
                    expect(betListHandlers["updateAmountAndAddHalfCashOut"]).toBeCalled();
                });

                it("should NOT call updateCashOutRow()", () => {
                    // Act
                    betListHandlers["handleNewOtherCashOut"](otherPlayer);

                    // Assert
                    expect(betListHandlers["updateCashOutRow"]).not.toBeCalled();
                });
            });

            describe("otherPlayer has only cashOut", () => {
                beforeEach(() => {
                    // Arrange
                    otherPlayer = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                        playerId,
                        cashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                        halfCashOut: undefined,
                    });
                });
                it("should call updateCashOutRow()", () => {
                    // Act
                    betListHandlers["handleNewOtherCashOut"](otherPlayer);

                    // Assert
                    expect(betListHandlers["updateCashOutRow"]).toBeCalled();
                });

                it("should NOT call updateAmountAndAddHalfCashOut()", () => {
                    // Act
                    betListHandlers["handleNewOtherCashOut"](otherPlayer);

                    // Assert
                    expect(betListHandlers["updateAmountAndAddHalfCashOut"]).not.toBeCalled();
                });
            });

            describe("otherPlayer has both halfCashOut and cashOut", () => {
                beforeEach(() => {
                    // Arrange
                    otherPlayer = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                        playerId,
                        halfCashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                        cashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                    });
                });
                it("should handle only halfCashout", () => {
                    // Act
                    betListHandlers["handleNewOtherCashOut"](otherPlayer);

                    // Assert
                    expect(betListHandlers["updateAmountAndAddHalfCashOut"]).toBeCalled();
                    expect(betListHandlers["updateCashOutRow"]).not.toBeCalled();
                });
            });
        });
    });

    describe("generateLeaderBoardPlayer", () => {
        let players: LeaderBoardPlayer[] = [];
        let player: GameCrashServiceMessage.CrashOtherPlayer;
        beforeEach(() => {
            players = [];
            betListHandlers["convertAmountAndWinValue"] = jest.fn();
            betListHandlers["updateCashOutRow"] = jest.fn();
            betListHandlers["convertAmountAndWinValue"] = jest.fn();
            betListHandlers["updateAmountAndAddHalfCashOut"] = jest.fn();
        });
        describe("has only cashOut", () => {
            beforeEach(() => {
                // Arrange
                player = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                    cashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                    halfCashOut: undefined,
                });
            });
            it("only added one player", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(players.length).toEqual(1);
            });
            it("call convertAmountAndWinValue", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["convertAmountAndWinValue"]).toBeCalled;
            });
            it("call updateCashOutRow", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["updateCashOutRow"]).toBeCalled;
            });
        });
        describe("has only halfCashOut", () => {
            beforeEach(() => {
                // Arrange
                player = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                    halfCashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                    cashOut: undefined,
                });
            });
            it("only added 2 player", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(players.length).toEqual(2);
            });
            it("call convertAmountAndWinValue", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["convertAmountAndWinValue"]).toBeCalled;
            });
            it("call updateAmountAndAddHalfCashOut", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["updateAmountAndAddHalfCashOut"]).toBeCalled;
            });
        });
        describe("has both halfCashOut and cashOut", () => {
            beforeEach(() => {
                // Arrange
                player = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                    halfCashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                    cashOut: stub<GameCrashServiceMessage.CashOutReceive>(),
                });
            });
            it("only added 2 player", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(players.length).toEqual(2);
            });
            it("call convertAmountAndWinValue", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["convertAmountAndWinValue"]).toBeCalled;
            });
            it("call updateAmountAndAddHalfCashOut", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["updateAmountAndAddHalfCashOut"]).toBeCalled;
            });
            it("call updateCashOutRow", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(betListHandlers["updateCashOutRow"]).toBeCalled;
            });
        });

        describe("NOT both halfCashOut and cashOut", () => {
            beforeEach(() => {
                // Arrange
                player = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                    cashOut: undefined,
                    halfCashOut: undefined,
                });
            });
            it("only added one player", () => {
                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(players.length).toEqual(1);
            });

            it("should convert amount value", () => {
                // Arrange
                const amount = 10;
                const mainRate = 1.2;
                const rate = 1.5;
                Object.defineProperty(mainPlayerStore, "rate", { value: mainRate, configurable: true, writable: true });
                const expectedAmount = NumberUtils.getValueByCurrency(amount, mainRate, rate);
                player = stub<GameCrashServiceMessage.CrashOtherPlayer>({
                    amount,
                    rate,
                    cashOut: undefined,
                    halfCashOut: undefined,
                });

                // Act
                betListHandlers["generateLeaderBoardPlayer"](players, player);

                // Assert
                expect(players[0].amount).toEqual(expectedAmount);
            });
        });
    });
});
