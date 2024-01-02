import { stub } from "jest-auto-stub";

import { BetInputHandler } from "../../../../src/game-crash/bet-input/bet-input-handlers";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { RoundStore } from "../../../../src/game/rounds/round-store";

describe("BetInputHandler", () => {
    let betInputHandler: BetInputHandler;
    let roundStore: RoundStore;
    let betInputStore: BetInputStore;

    beforeAll(() => {
        roundStore = stub<RoundStore>();
        betInputStore = stub<BetInputStore>({ betAmountTemp: 10, minBet: 10, maxBet: 100 });
    });

    beforeEach(() => {
        betInputHandler = new BetInputHandler(betInputStore, roundStore);
    });

    describe("handle", () => {
        it("should update betAmount for betInputStore", () => {
            // Arrange

            // Act
            betInputHandler.handle();

            // Assert
            expect(betInputHandler["betInputStore"].betAmount).toEqual(10);
        });

        it("should call closeBetAmountPopup()", () => {
            // Arrange
            betInputHandler.closeBetAmountPopup = jest.fn();

            // Act
            betInputHandler.handle();

            // Assert
            expect(betInputHandler.closeBetAmountPopup).toBeCalled();
        });
    });

    describe("setBetAmountTemp", () => {
        describe("when bet amount is not greater than maxBet", () => {
            it("should update betAmount", () => {
                // Arrange
                betInputHandler["betInputStore"].betAmountTemp = 20;
                const amount = 2;

                // Act
                betInputHandler.setBetAmountTemp(amount);

                // Assert
                expect(betInputHandler["betInputStore"].betAmountTemp).toEqual(22);
            });
        });
        describe("when bet amount is greater than maxBet", () => {
            it("should update betAmount to maxBet", () => {
                // Arrange
                betInputHandler["betInputStore"].betAmountTemp = 100;
                const amount = 2;

                // Act
                betInputHandler.setBetAmountTemp(amount);

                // Assert
                expect(betInputHandler["betInputStore"].betAmountTemp).toEqual(100);
            });
        });
    });

    describe("resetBetAmount", () => {
        it("should update betAmount to 0", () => {
            // Arrange

            // Act
            betInputHandler.resetBetAmount();

            // Assert
            expect(betInputHandler["betInputStore"].betAmountTemp).toEqual(0);
        });
    });

    describe("openBetAmountPopup", () => {
        it("should call resetBetAmount()", () => {
            // Arrange
            betInputHandler.resetBetAmount = jest.fn();

            // Act
            betInputHandler.openBetAmountPopup();

            // Assert
            expect(betInputHandler.resetBetAmount).toBeCalled();
        });

        it("should update isOpenBetAmountPopup to true", () => {
            // Arrange

            // Act
            betInputHandler.openBetAmountPopup();

            // Assert
            expect(betInputHandler["betInputStore"].isOpenBetAmountPopup).toEqual(true);
        });
    });

    describe("closeBetAmountPopup", () => {
        it("should update isOpenBetAmountPopup to false", () => {
            // Arrange

            // Act
            betInputHandler.closeBetAmountPopup();

            // Assert
            expect(betInputHandler["betInputStore"].isOpenBetAmountPopup).toEqual(false);
        });
    });

    describe("quickChangeBetAmount", () => {
        describe("when increasing betAmount", () => {
            describe("when betAmount > minBet and betAmount < maxBet", () => {
                it("should update betAmount to increased amount", () => {
                    // Arrange
                    betInputHandler["betInputStore"].betAmount = 20;

                    // Act
                    betInputHandler.quickChangeBetAmount(true);

                    // Assert
                    expect(betInputHandler["betInputStore"].betAmount).toEqual(30);
                });
            });

            describe("when betAmount > minBet and betAmount > maxBet", () => {
                it("should update betAmount to maxBet", () => {
                    // Arrange
                    betInputHandler["betInputStore"].betAmount = 100;

                    // Act
                    betInputHandler.quickChangeBetAmount(true);

                    // Assert
                    expect(betInputHandler["betInputStore"].betAmount).toEqual(100);
                });
            });
        });

        describe("when decreasing betAmount", () => {
            describe("when betAmount > minBet and betAmount < maxBet", () => {
                it("should update betAmount to increased amount", () => {
                    // Arrange
                    betInputHandler["betInputStore"].betAmount = 50;

                    // Act
                    betInputHandler.quickChangeBetAmount(false);

                    // Assert
                    expect(betInputHandler["betInputStore"].betAmount).toEqual(40);
                });
            });

            describe("when betAmount < minBet and betAmount < maxBet", () => {
                it("should update betAmount to minBet", () => {
                    // Arrange
                    betInputHandler["betInputStore"].betAmount = 10;

                    // Act
                    betInputHandler.quickChangeBetAmount(false);

                    // Assert
                    expect(betInputHandler["betInputStore"].betAmount).toEqual(10);
                });
            });
        });
    });
});
