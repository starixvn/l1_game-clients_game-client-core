import { stub } from "jest-auto-stub";
import { AutoPlayHandler } from "../../../../src/game-crash/auto-play/auto-play-handler";
import { AutoPlayStore } from "../../../../src/game-crash/auto-play/auto-play-store";
import { ButtonState } from "../../../../src/game-crash/game-crash-messages";
import { PlayerActionHandlers } from "../../../../src/game-crash/player-actions/player-action-handlers";
import { PlayerActionStore } from "../../../../src/game-crash/player-actions/player-action-store";
import { BetStore } from "../../../../src/game/bets/bet-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";

describe("PlayerActionHandlers", () => {
    let playerActionHandlers: PlayerActionHandlers;
    let playerActionStore: PlayerActionStore;
    let betStore: BetStore;
    let roundTimeStore: RoundTimeStore;
    let autoPlayStore: AutoPlayStore;
    let autoPlayHandler: AutoPlayHandler;

    beforeAll(() => {
        playerActionStore = stub<PlayerActionStore>();
        betStore = stub<BetStore>();
        roundTimeStore = stub<RoundTimeStore>();
        autoPlayStore = stub<AutoPlayStore>();
        autoPlayHandler = stub<AutoPlayHandler>();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        playerActionHandlers = new PlayerActionHandlers(playerActionStore, betStore, roundTimeStore, autoPlayStore, autoPlayHandler);
    });

    describe("changeButtonBetNextRound", () => {
        it("when auto play is valid", () => {
            //Arrange
            Object.defineProperty(autoPlayHandler, "isValidAutoPlay", { value: true, configurable: true, writable: true });

            //Act
            playerActionHandlers.changeButtonBetNextRound();

            //Assert
            expect(autoPlayHandler.autoEnableEarlyBet).toBeCalled();
        });

        it("when auto play is not valid", () => {
            //Arrange
            Object.defineProperty(autoPlayHandler, "isValidAutoPlay", { value: false, configurable: true, writable: true });
            playerActionHandlers.changeButtonState = jest.fn();

            //Act
            playerActionHandlers.changeButtonBetNextRound();

            //Assert
            expect(autoPlayHandler.cancelAutoPlay).toBeCalled();
            expect(playerActionHandlers.changeButtonState).toBeCalledWith(ButtonState.BET_NEXT_ROUND);
        });
    });

    describe("handleEndShowCashOutNotice", () => {
        it("when hide cash out notice", () => {
            //Arrange
            const flag = false;

            //Act
            playerActionHandlers.handleEndShowCashOutNotice(flag);

            //Assert
            expect(playerActionStore.endShowCashOutNotice).toBe(false);
        });
    });

    describe("changeButtonState", () => {
        it("when button state is BET ACCEPTED", () => {
            //Arrange
            const state = ButtonState.BET_ACCEPTED;

            //Act
            playerActionHandlers.changeButtonState(state);

            //Assert
            expect(playerActionStore.buttonState).toBe(ButtonState.BET_ACCEPTED);
        });
    });

    describe("handleReceivedBet", () => {
        describe("when have not received bet yet", () => {
            it("should not change button state", () => {
                //Arrange
                const lastReceivedBet = {
                    value: 0,
                    isAnimated: false,
                };
                autoPlayHandler.resetButtonState = jest.fn();
                autoPlayHandler.cancelEarlyBetAndAutoPlay = jest.fn();

                //Act
                playerActionHandlers.handleReceivedBet(lastReceivedBet);

                //Assert
                expect(autoPlayHandler.resetButtonState).toBeCalled();
                expect(autoPlayHandler.cancelEarlyBetAndAutoPlay).toBeCalled();
            });
        });
        describe("when have received bet", () => {
            //Arrange
            const lastReceivedBet = {
                value: 5,
                isAnimated: false,
            };
            it("when round time is placing bet", () => {
                //Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, configurable: true, writable: true });
                playerActionHandlers.changeButtonState = jest.fn();

                //Act
                playerActionHandlers.handleReceivedBet(lastReceivedBet);

                //Assert
                expect(playerActionHandlers.changeButtonState).toBeCalledWith(ButtonState.BET_ACCEPTED);
            });

            it("when rounds of auto play is 0", () => {
                //Arrange
                Object.defineProperty(autoPlayStore, "roundsAutoPlay", { value: 0, configurable: true, writable: true });
                autoPlayHandler.cancelAutoPlay = jest.fn();

                //Act
                playerActionHandlers.handleReceivedBet(lastReceivedBet);

                //Assert
                expect(autoPlayHandler.cancelAutoPlay).toBeCalled();
            });
        });
    });

    describe("handleFlyingTime", () => {
        it("when not flying time", () => {
            //Arrange
            const roundTime = 10;
            playerActionHandlers["changeButtonStateWhenFlyTime"] = jest.fn();

            //Act
            playerActionHandlers.handleFlyingTime(roundTime);

            //Assert
            expect(playerActionHandlers["changeButtonStateWhenFlyTime"]).not.toBeCalled();
        });
        it("when flying time", () => {
            //Arrange
            const roundTime = 0;
            playerActionHandlers["changeButtonStateWhenFlyTime"] = jest.fn();

            //Act
            playerActionHandlers.handleFlyingTime(roundTime);

            //Assert
            expect(playerActionHandlers["changeButtonStateWhenFlyTime"]).toBeCalled();
        });
    });

    describe("changeButtonStateWhenFlyTime", () => {
        it("when button state is BET_ACCEPTED", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.BET_ACCEPTED;
            playerActionHandlers.changeButtonState = jest.fn();

            //Act
            playerActionHandlers["changeButtonStateWhenFlyTime"]();

            //Assert
            expect(playerActionHandlers.changeButtonState).toBeCalledWith(ButtonState.CASH_OUT);
        });

        it("when button state is PLACE BET", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;
            playerActionHandlers.changeButtonBetNextRound = jest.fn();

            //Act
            playerActionHandlers["changeButtonStateWhenFlyTime"]();

            //Assert
            expect(playerActionHandlers.changeButtonBetNextRound).toBeCalled();
        });
    });

    describe("handlePlacingBet", () => {
        it("when changeButtonState to be called", () => {
            //Arrange
            playerActionHandlers.changeButtonState = jest.fn();
            const isPlacingBet = true;
            playerActionStore.buttonState = ButtonState.CASH_OUT;
            autoPlayStore.isAutoPlay = false;

            //Act
            playerActionHandlers.handlePlacingBet(isPlacingBet);

            //Assert
            expect(playerActionHandlers.changeButtonState).toBeCalledWith(ButtonState.PLACE_BET);
        });
    });

    describe("handleShowingResult", () => {
        it("when button state is PLACE BET", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;
            const showingResult = true;
            playerActionHandlers.changeButtonBetNextRound = jest.fn();

            //Act
            playerActionHandlers.handleShowingResult(showingResult);

            //Assert
            expect(playerActionHandlers.changeButtonBetNextRound).toBeCalled();
        });

        it("when button state is not PLACE BET", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.BET_ACCEPTED;
            const showingResult = true;
            playerActionHandlers.changeButtonBetNextRound = jest.fn();

            //Act
            playerActionHandlers.handleShowingResult(showingResult);

            //Assert
            expect(playerActionHandlers.changeButtonBetNextRound).not.toBeCalled();
        });
    });
});
