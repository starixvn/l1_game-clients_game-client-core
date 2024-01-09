import { stub } from "jest-auto-stub";

import { CrashBetListHandlers } from "../../../../src/game-crash/bet-list/crash-bet-list-handlers";
import { CrashBetListStore } from "../../../../src/game-crash/bet-list/crash-bet-list-store";
import { CrashCashOutStore } from "../../../../src/game-crash/cash-out/crash-cash-out-store";
import { BetStore } from "../../../../src/game/bets/bet-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";
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

    describe("reactionPlacingBet", () => {
        beforeEach(() => {
            // Arrange
            betListHandlers["resetMainPlayer"] = jest.fn();
            betListHandlers["resetOtherPlayerList"] = jest.fn();
        });

        describe("when placing bet", () => {
            const isStartPlacingBet = true;

            it("should call resetMainPlayer()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetMainPlayer"]).toBeCalled();
            });

            it("should call resetOtherPlayerList()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetOtherPlayerList"]).toBeCalled();
            });
        });
        describe("when not placing bet", () => {
            const isStartPlacingBet = false;

            it("should not call resetMainPlayer()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetMainPlayer"]).not.toBeCalled();
            });

            it("should not call resetOtherPlayerList()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetOtherPlayerList"]).not.toBeCalled();
            });
        });
    });

    describe("reactionRoundTime", () => {
        describe("when roundTime is less than 0", () => {
            it("should update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const roundTime = -5;
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: false, configurable: true, writable: true });

                // Act
                betListHandlers["reactionRoundTime"](roundTime);

                // Assert
                expect(betListHandlers["betListStore"].isNeedEmptyBetAmount).toEqual(true);
            });
        });

        describe("when roundTime is greater than placing bet time, less than full time and isDisplayingResultState is true", () => {
            it("should update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const roundTime = 12;
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: false, configurable: true, writable: true });
                Object.defineProperty(roundTimeStore, "isDisplayingResultState", { value: true, configurable: true, writable: true });

                // Act
                betListHandlers["reactionRoundTime"](roundTime);

                // Assert
                expect(betListHandlers["betListStore"].isNeedEmptyBetAmount).toEqual(true);
            });
        });

        describe("when roundTime is in placing bet time", () => {
            it("should not update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const roundTime = 9;
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: false, configurable: true, writable: true });
                Object.defineProperty(roundTimeStore, "isDisplayingResultState", { value: false, configurable: true, writable: true });

                // Act
                betListHandlers["reactionRoundTime"](roundTime);

                // Assert
                expect(betListHandlers["betListStore"].isNeedEmptyBetAmount).toEqual(false);
            });
        });
    });

    describe("reactionLastReceivedBet", () => {
        describe("when lastReceivedBet is null", () => {
            it("should not update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = null;
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet as any);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(true);
            });

            it("should not update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = null;
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet as any);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(null);
            });
        });

        describe("when lastReceivedBet has data, but a bet value is less than 0", () => {
            it("should not update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = { value: -1, isAnimated: false };
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(true);
            });

            it("should not update mainPlayer of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = { value: -1, isAnimated: false };
                Object.defineProperty(betListStore, "mainPlayer", { value: null, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet);

                // Assert
                expect(betListStore["mainPlayer"]).toEqual(null);
            });
        });

        describe("when lastReceivedBet has data and a bet value is greater than 0", () => {
            it("should update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const lastReceivedBet = { value: 1, isAnimated: false };
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](lastReceivedBet);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(false);
            });

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
            it("should not update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange
                const halfCashOut = null;
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });

                // Act
                betListHandlers["reactionLastReceivedBet"](halfCashOut as any);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(true);
            });

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
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });
            });

            it("should update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange

                // Act
                betListHandlers["reactionHalfCashOut"](halfCashOut);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(false);
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
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });
            });

            it("should not update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange

                // Act
                betListHandlers["reactionCashOut"](cashOut as any);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(true);
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
                Object.defineProperty(betListStore, "isNeedEmptyBetAmount", { value: true, configurable: true, writable: true });
            });

            it("should update isNeedEmptyBetAmount of CrashBetListStore", () => {
                // Arrange

                // Act
                betListHandlers["reactionCashOut"](cashOut);

                // Assert
                expect(betListStore["isNeedEmptyBetAmount"]).toEqual(false);
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

    describe("updateAndSortBetListByPlayerChip", () => {
        it("should return new sorted player list by bet amount", () => {
            // Arrange
            const existedPlayers = [player1];
            const players = [player2];
            const expectedData = [player2, player1];
            Object.defineProperty(betListStore, "betList", { value: { players: existedPlayers }, configurable: true, writable: true });

            // Act
            const newPlayers = betListHandlers["updateAndSortBetListByPlayerChip"](players);

            // Assert
            expect(newPlayers).toEqual(expectedData);
        });
    });

    describe("updatePlayerListByBetList", () => {
        const players = [player1, player2];
        const expectedData = [player2, player1];

        beforeEach(() => {
            // Arrange
            Object.defineProperty(betListStore, "betList", {
                value: {
                    players: [],
                },
                configurable: true,
                writable: true,
            });
            betListHandlers["sortCashOutPlayersByTime"] = jest.fn(() => {
                return [];
            });
            betListHandlers["sortBetPlayersByAmount"] = jest.fn(() => {
                return expectedData;
            });
        });

        it("should call sortCashOutPlayersByTime()", () => {
            // Arrange

            // Act
            betListHandlers["updatePlayerListByBetList"](players);

            // Assert
            expect(betListHandlers["sortCashOutPlayersByTime"]).toBeCalled();
        });

        it("should call sortBetPlayersByAmount()", () => {
            // Arrange

            // Act
            betListHandlers["updatePlayerListByBetList"](players);

            // Assert
            expect(betListHandlers["sortBetPlayersByAmount"]).toBeCalled();
        });

        it("should return new sorted player list", () => {
            // Arrange

            // Act
            const playerList = betListHandlers["updatePlayerListByBetList"](players);

            // Assert
            expect(playerList).toEqual(expectedData);
        });
    });

    describe("sortBetPlayersByAmount", () => {
        it("should return decreased player list by bet amount", () => {
            // Arrange
            const players = [player1, player2];
            const expectedData = [player2, player1];

            // Act
            const newPlayers = betListHandlers["sortBetPlayersByAmount"](players);

            // Assert
            expect(newPlayers).toEqual(expectedData);
        });
    });

    describe("sortCashOutPlayersByTime", () => {
        it("should return decreased player list by cash out time", () => {
            // Arrange
            const players = [player3HalfCashOut, player4CashOut];
            const expectedData = [player4CashOut, player3HalfCashOut];

            // Act
            const newPlayers = betListHandlers["sortCashOutPlayersByTime"](players);

            // Assert
            expect(newPlayers).toEqual(expectedData);
        });
    });

    describe("convertCurrency", () => {
        describe("when data has bet amount", () => {
            it("should return player list with converted bet amount", () => {
                // Arrange
                const players = [player5];
                const expectedData = [mockedConvertedCurrencyPlayer5];
                jest.spyOn(NumberUtils, "getValueByCurrency").mockReturnValue(mockedConvertedCurrencyValue);

                // Act
                const newPlayers = betListHandlers["convertCurrency"](players);

                // Assert
                expect(newPlayers).toEqual(expectedData);
            });
        });

        describe("when data has half cash out", () => {
            it("should return player list with converted cash out win", () => {
                // Arrange
                const players = [player3HalfCashOut];
                const expectedData = [...players];
                expectedData[0].amount = mockedConvertedCurrencyValue;
                expectedData[0]["halfCashOut"].win = mockedConvertedCurrencyValue;
                jest.spyOn(NumberUtils, "getValueByCurrency").mockReturnValue(mockedConvertedCurrencyValue);

                // Act
                const newPlayers = betListHandlers["convertCurrency"](players);

                // Assert
                expect(newPlayers).toEqual(expectedData);
            });
        });

        describe("when data has cash out", () => {
            it("should return player list with converted cash out win", () => {
                // Arrange
                const players = [player6CashOut];
                const expectedData = [player6CashOut];
                jest.spyOn(NumberUtils, "getValueByCurrency").mockReturnValue(mockedConvertedCurrencyValue);

                // Act
                const newPlayers = betListHandlers["convertCurrency"](players);

                // Assert
                expect(newPlayers).toEqual(expectedData);
            });
        });
    });

    describe("resetOtherPlayerList", () => {
        it("should set bet list to empty array", () => {
            // Arrange
            const expectedData = { players: [] };

            // Act
            betListHandlers["resetOtherPlayerList"]();

            // Assert
            expect(betListStore.betList).toEqual(expectedData);
        });
    });

    describe("resetMainPlayer", () => {
        it("should set main player to null", () => {
            // Arrange

            // Act
            betListHandlers["resetMainPlayer"]();

            // Assert
            expect(betListStore.mainPlayer).toEqual(null);
        });
    });

    describe("updateBetListCashOut", () => {
        describe("when other player cash is not existed in player list", () => {
            it("should return update player cashed out on top", () => {
                // Arrange
                Object.defineProperty(betListStore, "betList", { value: { players: [] }, configurable: true, writable: true });

                // Act
                betListHandlers.updateBetListCashOut(player4CashOut);

                // Assert
                expect(betListStore.betList).toEqual({ players: [] });
            });
        });

        describe("when other player cash out is existed in player list", () => {
            it("should return update player cashed out on top", () => {
                // Arrange
                Object.defineProperty(betListStore, "betList", {
                    value: {
                        players: [player4, player2],
                    },
                    configurable: true,
                    writable: true,
                });

                const expectedData = {
                    players: [player4CashOut, player2],
                };

                // Act
                betListHandlers.updateBetListCashOut(player4CashOut);

                // Assert
                expect(betListStore.betList).toEqual(expectedData);
            });
        });
    });

    describe("handleBetList", () => {
        const betList = [player1];
        const mockedData = betList;

        beforeEach(() => {
            // Arrange
            betListHandlers["convertCurrency"] = jest.fn();
            betListHandlers["updatePlayerListByBetList"] = jest.fn(() => mockedData);
        });

        it("should call convertCurrency()", () => {
            // Arrange

            // Act
            betListHandlers["handleBetList"](betList);

            // Assert
            expect(betListHandlers["convertCurrency"]).toBeCalled();
        });

        it("should call updatePlayerListByBetList()", () => {
            // Arrange

            // Act
            betListHandlers["handleBetList"](betList);

            // Assert
            expect(betListHandlers["updatePlayerListByBetList"]).toBeCalled();
        });

        it("should update betList of CrashBetListStore", () => {
            // Arrange
            const expectedData = { players: mockedData };

            // Act
            betListHandlers["handleBetList"](betList);

            // Assert
            expect(betListStore.betList).toEqual(expectedData);
        });
    });

    describe("handlePlayerChip", () => {
        const playerChip = player1;
        const mockedData = [playerChip];

        beforeEach(() => {
            // Arrange
            betListHandlers["convertCurrency"] = jest.fn();
            betListHandlers["updateAndSortBetListByPlayerChip"] = jest.fn(() => mockedData);
        });

        it("should call convertCurrency()", () => {
            // Arrange

            // Act
            betListHandlers["handlePlayerChip"](playerChip);

            // Assert
            expect(betListHandlers["convertCurrency"]).toBeCalled();
        });

        it("should call updateAndSortBetListByPlayerChip()", () => {
            // Arrange

            // Act
            betListHandlers["handlePlayerChip"](playerChip);

            // Assert
            expect(betListHandlers["updateAndSortBetListByPlayerChip"]).toBeCalled();
        });

        it("should update betList of CrashBetListStore", () => {
            // Arrange
            const expectedData = { players: mockedData };

            // Act
            betListHandlers["handlePlayerChip"](playerChip);

            // Assert
            expect(betListStore.betList).toEqual(expectedData);
        });
    });
});
