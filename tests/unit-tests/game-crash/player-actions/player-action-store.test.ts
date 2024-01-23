import { stub } from "jest-auto-stub";
import { AutoPlayStore } from "../../../../src/game-crash/auto-play/auto-play-store";
import { CrashCashOutStore } from "../../../../src/game-crash/cash-out/crash-cash-out-store";
import { ButtonState, RocketState } from "../../../../src/game-crash/game-crash-messages";
import { MultiplierStore } from "../../../../src/game-crash/multiplier/multiplier-store";
import { PlayerActionStore } from "../../../../src/game-crash/player-actions/player-action-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";

describe("PlayerActionStore", () => {
    let playerActionStore: PlayerActionStore;
    let autoPlayStore: AutoPlayStore;
    let roundTimeStore: RoundTimeStore;
    let multiplierStore: MultiplierStore;
    let cashOutStore: CrashCashOutStore;

    beforeAll(() => {
        roundTimeStore = stub<RoundTimeStore>();
        autoPlayStore = stub<AutoPlayStore>();
        multiplierStore = stub<MultiplierStore>();
        cashOutStore = stub<CrashCashOutStore>();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        playerActionStore = new PlayerActionStore(autoPlayStore, roundTimeStore, multiplierStore, cashOutStore);
    });

    describe("init default values", () => {
        it("when button state is PLACE BET", () => {
            //Arrange

            //Act

            //Assert
            expect(playerActionStore.buttonState).toBe(ButtonState.PLACE_BET);
        });

        it("activeAutoPlay equal false", () => {
            //Arrange

            //Act

            //Assert
            expect(playerActionStore.activeAutoPlay).toBe(false);
        });

        it("endShowCashOutNotice", () => {
            //Arrange

            //Act

            //Assert
            expect(playerActionStore.endShowCashOutNotice).toBe(false);
        });
    });

    describe("visibleBetNextRound", () => {
        it("when button state is BET NEXT ROUND", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND;

            //Act

            //Assert
            expect(playerActionStore.visibleBetNextRound).toBe(true);
        });

        it("when button state is not BET NEXT ROUND", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;

            //Act

            //Assert
            expect(playerActionStore.visibleBetNextRound).toBe(false);
        });
    });

    describe("visibleCashOut", () => {
        it("when button state is CASH_OUT", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.CASH_OUT;

            //Act

            //Assert
            expect(playerActionStore.visibleCashOut).toBe(true);
        });

        it("when button state is not CASH_OUT", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;

            //Act

            //Assert
            expect(playerActionStore.visibleCashOut).toBe(false);
        });
    });

    describe("disableBetAmount", () => {
        it("when button state is CASH_OUT", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.CASH_OUT;

            //Act

            //Assert
            expect(playerActionStore.disableBetAmount).toBe(true);
        });

        it("when button state is BET ACCEPTED", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.BET_ACCEPTED;

            //Act

            //Assert
            expect(playerActionStore.disableBetAmount).toBe(true);
        });

        it("when button state is not PLACE BET", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;

            //Act

            //Assert
            expect(playerActionStore.disableBetAmount).toBe(false);
        });
    });

    describe("autoEarlyBet", () => {
        describe("when roundsAutoPlay greater than 0", () => {
            beforeEach(() => {
                autoPlayStore.roundsAutoPlay = 1;
            });

            it("when isAutoPlay equal true", () => {
                //Arrange
                autoPlayStore.isAutoPlay = true;

                //Act

                //Assert
                expect(playerActionStore.autoEarlyBet).toBe(true);
            });

            it("when isAutoPlay equal false", () => {
                //Arrange
                autoPlayStore.isAutoPlay = false;

                //Act

                //Assert
                expect(playerActionStore.autoEarlyBet).toBe(false);
            });
        });

        describe("when roundsAutoPlay equal 0", () => {
            beforeEach(() => {
                autoPlayStore.roundsAutoPlay = 0;
            });
            it("when isAutoPlay equal true", () => {
                //Arrange
                autoPlayStore.isAutoPlay = true;

                //Act

                //Assert
                expect(playerActionStore.autoEarlyBet).toBe(false);
            });

            it("when isAutoPlay equal false", () => {
                //Arrange
                autoPlayStore.isAutoPlay = false;

                //Act

                //Assert
                expect(playerActionStore.autoEarlyBet).toBe(false);
            });
        });
    });

    describe("latestRound", () => {
        describe("when roundsAutoPlay greater than 0", () => {
            beforeEach(() => {
                autoPlayStore.roundsAutoPlay = 1;
            });

            it("when isAutoPlay equal true", () => {
                //Arrange
                autoPlayStore.isAutoPlay = true;

                //Act

                //Assert
                expect(playerActionStore.latestRound).toBe(false);
            });

            it("when isAutoPlay equal false", () => {
                //Arrange
                autoPlayStore.isAutoPlay = false;

                //Act

                //Assert
                expect(playerActionStore.latestRound).toBe(false);
            });
        });

        describe("when roundsAutoPlay equal 0", () => {
            beforeEach(() => {
                autoPlayStore.roundsAutoPlay = 0;
            });
            it("when isAutoPlay equal true", () => {
                //Arrange
                autoPlayStore.isAutoPlay = true;

                //Act

                //Assert
                expect(playerActionStore.latestRound).toBe(true);
            });

            it("when isAutoPlay equal false", () => {
                //Arrange
                autoPlayStore.isAutoPlay = false;

                //Act

                //Assert
                expect(playerActionStore.latestRound).toBe(false);
            });
        });
    });

    describe("disabledWaitingBet", () => {
        describe("when button state is CANCEL BET", () => {
            beforeEach(() => {
                playerActionStore.buttonState = ButtonState.CANCEL_BET;
            });
            it("when isPlacingBet equal true", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledWaitingBet).toBe(true);
            });

            it("when isPlacingBet equal false", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });

                //Act

                //assert
                expect(playerActionStore.disabledWaitingBet).toBe(false);
            });
        });

        describe("when button state is not CANCEL BET", () => {
            beforeEach(() => {
                playerActionStore.buttonState = ButtonState.CASH_OUT;
            });
            it("when isPlacingBet equal true", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledWaitingBet).toBe(false);
            });

            it("when isPlacingBet equal false", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });

                //Act

                //assert
                expect(playerActionStore.disabledWaitingBet).toBe(false);
            });
        });
    });

    describe("disabledAutoCashout", () => {
        describe("when isPlacingBet is false", () => {
            beforeEach(() => {
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });
            });
            it("when button state is CASH_OUT", () => {
                //Arrange
                playerActionStore.buttonState = ButtonState.CASH_OUT;

                //Act

                //Assert
                expect(playerActionStore.disabledAutoCashout).toBe(true);
            });

            it("when button state is CANCEL_BET", () => {
                //Arrange
                playerActionStore.buttonState = ButtonState.CANCEL_BET;

                //Act

                //Assert
                expect(playerActionStore.disabledAutoCashout).toBe(false);
            });
        });

        describe("when isPlacingBet is true", () => {
            beforeEach(() => {
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
            });
            it("when button state is CASH_OUT", () => {
                //Arrange
                playerActionStore.buttonState = ButtonState.CASH_OUT;

                //Act

                //Assert
                expect(playerActionStore.disabledAutoCashout).toBe(true);
            });

            it("when button state is CANCEL_BET", () => {
                //Arrange
                playerActionStore.buttonState = ButtonState.CANCEL_BET;

                //Act

                //Assert
                expect(playerActionStore.disabledAutoCashout).toBe(true);
            });
        });
    });

    describe("disabledCashOut", () => {
        describe("when rocket state is CRASHED", () => {
            beforeEach(() => {
                Object.defineProperty(multiplierStore, "rocketState", { value: RocketState.CRASHED, writable: true, configurable: true });
            });
            it("when isPlacingBet is true and button state is CASH_OUT", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.CASH_OUT;

                //Act

                //Assert
                expect(playerActionStore.disabledCashOut).toBe(true);
            });

            it("when isPlacingBet is true and button state is not CASH_OUT", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.PLACE_BET;

                //Act

                //Assert
                expect(playerActionStore.disabledCashOut).toBe(true);
            });
        });

        describe("when rocket state is FLYING", () => {
            beforeEach(() => {
                Object.defineProperty(multiplierStore, "rocketState", { value: RocketState.CRASHED, writable: true, configurable: true });
            });
            it("when isPlacingBet is true and button state is CASH_OUT", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.CASH_OUT;

                //Act

                //Assert
                expect(playerActionStore.disabledCashOut).toBe(true);
            });

            it("when isPlacingBet is true and button state is not CASH_OUT", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.PLACE_BET;

                //Act

                //Assert
                expect(playerActionStore.disabledCashOut).toBe(true);
            });
        });
    });

    describe("disabledFullCashOut", () => {
        describe("when button state is CASH_OUT and isPlacingBet is true", () => {
            beforeEach(() => {
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.CASH_OUT;
            });
            it("when isFullCashedOut is true", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isFullCashedOut", { value: true, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledFullCashOut).toBe(true);
            });

            it("when isFullCashedOut is false", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isFullCashedOut", { value: false, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledFullCashOut).toBe(true);
            });
        });

        describe("when button state is CASH_OUT and isPlacingBet is false", () => {
            beforeEach(() => {
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.CASH_OUT;
                Object.defineProperty(multiplierStore, "rocketState", { value: RocketState.FLYING, writable: true, configurable: true });
            });
            it("when isFullCashedOut is true", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isFullCashedOut", { value: true, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledFullCashOut).toBe(true);
            });

            it("when isFullCashedOut is false", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isFullCashedOut", { value: false, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledFullCashOut).toBe(false);
            });
        });
    });

    describe("disabledHalfCashOut", () => {
        describe("when button state is CASH_OUT, isPlacingBet is true and isFullCashedOut is true", () => {
            beforeEach(() => {
                Object.defineProperty(cashOutStore, "isFullCashedOut", { value: true, writable: true, configurable: true });
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });
                playerActionStore.buttonState = ButtonState.CASH_OUT;
            });
            it("when isHalfCashedOut is true", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isHalfCashedOut", { value: true, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledHalfCashOut).toBe(true);
            });

            it("when isHalfCashedOut is false", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isHalfCashedOut", { value: false, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledHalfCashOut).toBe(true);
            });
        });

        describe("when rocket state is FLYING, isPlacingBet is false and isFullCashedOut is false", () => {
            beforeEach(() => {
                Object.defineProperty(cashOutStore, "isFullCashedOut", { value: false, writable: true, configurable: true });
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });
                multiplierStore.rocketState = RocketState.FLYING;
            });
            it("when isHalfCashedOut is true", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isHalfCashedOut", { value: true, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledHalfCashOut).toBe(true);
            });

            it("when isHalfCashedOut is false", () => {
                //Arrange
                Object.defineProperty(cashOutStore, "isHalfCashedOut", { value: false, writable: true, configurable: true });

                //Act

                //Assert
                expect(playerActionStore.disabledHalfCashOut).toBe(false);
            });
        });
    });
});
