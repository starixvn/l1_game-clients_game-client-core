import { stub } from "jest-auto-stub";
import { ButtonState } from "../../../../src/game-crash";
import { AutoPlayHandler } from "../../../../src/game-crash/auto-play/auto-play-handler";
import { AutoPlayStore } from "../../../../src/game-crash/auto-play/auto-play-store";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { CrashBetHandler } from "../../../../src/game-crash/bet/crash-bet-handler";
import { EarlyBetStore } from "../../../../src/game-crash/bet/early-bet-store";
import { PlayerActionStore } from "../../../../src/game-crash/player-actions/player-action-store";
import { BetStore } from "../../../../src/game/bets/bet-store";
import { DisabledGameStore } from "../../../../src/game/disabled-game";
import { ErrorStore } from "../../../../src/game/errors/error-store";
import { NoticeStore } from "../../../../src/game/notices/notice-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";

describe("AutoPlayHandler", () => {
    let handler: AutoPlayHandler;
    let autoPlayStore: AutoPlayStore;
    let earlyBetStore: EarlyBetStore;
    let betInputStore: BetInputStore;
    let betStore: BetStore;
    let mainPlayerStore: MainPlayerStore;
    let noticeStore: NoticeStore;
    let playerActionStore: PlayerActionStore;
    let roundTimeStore: RoundTimeStore;
    let crashBetHandler: CrashBetHandler;
    let errorStore: ErrorStore;
    let disabledGameStore: DisabledGameStore;

    beforeEach(() => {
        autoPlayStore = stub<AutoPlayStore>();
        earlyBetStore = stub<EarlyBetStore>();
        betInputStore = stub<BetInputStore>();
        betStore = stub<BetStore>();
        mainPlayerStore = stub<MainPlayerStore>();
        noticeStore = stub<NoticeStore>();
        playerActionStore = stub<PlayerActionStore>();
        roundTimeStore = stub<RoundTimeStore>();
        crashBetHandler = stub<CrashBetHandler>();
        errorStore = stub<ErrorStore>();
        disabledGameStore = stub<DisabledGameStore>();

        handler = new AutoPlayHandler(
            autoPlayStore,
            earlyBetStore,
            betInputStore,
            betStore,
            mainPlayerStore,
            noticeStore,
            playerActionStore,
            roundTimeStore,
            crashBetHandler,
            errorStore,
            disabledGameStore
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("resetButtonState", () => {
        describe("current button state is CASH_OUT", () => {
            beforeEach(() => {
                playerActionStore.buttonState = ButtonState.CASH_OUT;
            });

            it("should change button state to PLACE_BET, when isPlacingBet", () => {
                // Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });

                // Act
                handler.resetButtonState();

                // Assert
                expect(playerActionStore.buttonState).toEqual(ButtonState.PLACE_BET);
            });

            it("should KEEP button state CASH_OUT, when not isPlacingBet", () => {
                // Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });

                // Act
                handler.resetButtonState();

                // Assert
                expect(playerActionStore.buttonState).toEqual(ButtonState.CASH_OUT);
            });
        });
        describe("current button state is CANCEL_BET", () => {
            beforeEach(() => {
                playerActionStore.buttonState = ButtonState.CANCEL_BET;
            });
            it("should change button state to PLACE_BET, when isPlacingBet", () => {
                // Arrange
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, writable: true, configurable: true });

                // Act
                handler.resetButtonState();

                // Assert
                expect(playerActionStore.buttonState).toEqual(ButtonState.PLACE_BET);
            });

            describe("when not isPlacingBet", () => {
                beforeEach(() => {
                    Object.defineProperty(roundTimeStore, "isPlacingBet", { value: false, writable: true, configurable: true });
                });
                it("should change button state to BET_NEXT_ROUND, when earlyBetEnable false", () => {
                    // Arrange

                    Object.defineProperty(earlyBetStore, "earlyBetEnable", { value: false, writable: true, configurable: true });

                    // Act
                    handler.resetButtonState();

                    // Assert
                    expect(playerActionStore.buttonState).toEqual(ButtonState.BET_NEXT_ROUND);
                });

                it("should KEEP button state CANCEL_BET, when earlyBetEnable true", () => {
                    // Arrange

                    Object.defineProperty(earlyBetStore, "earlyBetEnable", { value: true, writable: true, configurable: true });

                    // Act
                    handler.resetButtonState();

                    // Assert
                    expect(playerActionStore.buttonState).toEqual(ButtonState.CANCEL_BET);
                });
            });
        });

        it("current button state is PLACE_BET should keep button state", () => {
            // Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;

            // Act
            handler.resetButtonState();

            // Assert
            expect(playerActionStore.buttonState).toEqual(ButtonState.PLACE_BET);
        });
        it("current button state is BET_ACCEPTED should keep button state", () => {
            // Arrange
            playerActionStore.buttonState = ButtonState.BET_ACCEPTED;

            // Act
            handler.resetButtonState();

            // Assert
            expect(playerActionStore.buttonState).toEqual(ButtonState.BET_ACCEPTED);
        });

        it("current button state is BET_NEXT_ROUND should keep button state", () => {
            // Arrange
            playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND;

            // Act
            handler.resetButtonState();

            // Assert
            expect(playerActionStore.buttonState).toEqual(ButtonState.BET_NEXT_ROUND);
        });
    });

    describe("handleCancelAutoPlayWhenApiError", () => {
        beforeEach(() => {
            handler.cancelEarlyBetAndAutoPlay = jest.fn();
            handler.resetButtonState = jest.fn();
        });

        it("should call cancelEarlyBetAndAutoPlay", () => {
            // Act
            handler.handleCancelAutoPlayWhenApiError();

            // Assert
            expect(handler.cancelEarlyBetAndAutoPlay).toBeCalled();
        });

        it("should call resetButtonState", () => {
            // Act
            handler.handleCancelAutoPlayWhenApiError();

            // Assert
            expect(handler.resetButtonState).toBeCalled();
        });
    });

    describe("handleAutoPlaceBetAtPlacingBet", () => {
        beforeEach(() => {
            handler.autoPlaceBet = jest.fn();
        });

        it("should call autoPlaceBet, when isAutoPlay true", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isAutoPlay", { value: true, configurable: true, writable: true });

            // Act
            handler.handleAutoPlaceBetAtPlacingBet();

            // Assert
            expect(handler.autoPlaceBet).toBeCalled();
        });

        it("should call autoPlaceBet, when earlyBetEnable true", () => {
            // Arrange
            Object.defineProperty(earlyBetStore, "earlyBetEnable", { value: true, configurable: true, writable: true });

            // Act
            handler.handleAutoPlaceBetAtPlacingBet();

            // Assert
            expect(handler.autoPlaceBet).toBeCalled();
        });

        it("should NOT call autoPlaceBet, when isAutoPlay false and earlyBetEnable false", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isAutoPlay", { value: false, configurable: true, writable: true });
            Object.defineProperty(earlyBetStore, "earlyBetEnable", { value: false, configurable: true, writable: true });

            // Act
            handler.handleAutoPlaceBetAtPlacingBet();

            // Assert
            expect(handler.autoPlaceBet).not.toBeCalled();
        });
    });

    describe("autoPlaceBet", () => {
        beforeEach(() => {
            handler.updateAutoPlayRounds = jest.fn();
            handler.checkFinishedAutoPlay = jest.fn();
            handler.isValidBet = jest.fn();
            handler.cancelAutoPlay = jest.fn();
            crashBetHandler.autoPlaceBet = jest.fn();
        });

        it("should call updateAutoPlayRounds, when skipDecreaseAutoPlayCount false", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "roundsAutoPlay", { value: 5, configurable: true, writable: true });
            Object.defineProperty(autoPlayStore, "skipDecreaseAutoPlayCount", { value: false, configurable: true, writable: true });

            // Act
            handler.autoPlaceBet();

            // Assert
            expect(handler.updateAutoPlayRounds).toBeCalledWith(autoPlayStore.roundsAutoPlay - 1);
        });

        it("should NOT call updateAutoPlayRounds, when skipDecreaseAutoPlayCount true", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "skipDecreaseAutoPlayCount", { value: true, configurable: true, writable: true });

            // Act
            handler.autoPlaceBet();

            // Assert
            expect(handler.updateAutoPlayRounds).not.toBeCalled();
        });

        it("should set autoPlayStore.skipDecreaseAutoPlayCount to false", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "skipDecreaseAutoPlayCount", { value: true, configurable: true, writable: true });

            // Act
            handler.autoPlaceBet();

            // Assert
            expect(autoPlayStore.skipDecreaseAutoPlayCount).toEqual(false);
        });

        it("should set earlyBetStore.earlyBetEnable to false", () => {
            // Arrange
            Object.defineProperty(earlyBetStore, "earlyBetEnable", { value: true, configurable: true, writable: true });

            // Act
            handler.autoPlaceBet();

            // Assert
            expect(earlyBetStore.earlyBetEnable).toEqual(false);
        });

        it("should call crashBetHandler.autoPlaceBet", () => {
            // Arrange
            handler.checkFinishedAutoPlay = jest.fn(() => false);
            handler.isValidBet = jest.fn(() => true);
            Object.defineProperty(disabledGameStore, "disabled", { value: false, configurable: true, writable: true });

            // Act
            handler.autoPlaceBet();

            // Assert
            expect(crashBetHandler.autoPlaceBet).toBeCalled();
        });

        describe("should call cancelAutoPlay, and set buttonState to PLACE_BET", () => {
            beforeEach(() => {
                // Arrange
                handler.checkFinishedAutoPlay = jest.fn(() => false);
                handler.isValidBet = jest.fn(() => true);
                Object.defineProperty(disabledGameStore, "disabled", { value: false, configurable: true, writable: true });
            });
            it("when checkFinishedAutoPlay return true", () => {
                // Arrange
                handler.checkFinishedAutoPlay = jest.fn(() => true);

                // Act
                handler.autoPlaceBet();

                // Assert
                expect(handler.cancelAutoPlay).toBeCalled();
                expect(playerActionStore.buttonState).toEqual(ButtonState.PLACE_BET);
            });

            it("when isValidBet return false", () => {
                // Arrange
                handler.isValidBet = jest.fn(() => false);

                // Act
                handler.autoPlaceBet();

                // Assert
                expect(handler.cancelAutoPlay).toBeCalled();
                expect(playerActionStore.buttonState).toEqual(ButtonState.PLACE_BET);
            });

            it("when disabledGameStore.disabled is true", () => {
                // Arrange
                Object.defineProperty(disabledGameStore, "disabled", { value: true, configurable: true, writable: true });

                // Act
                handler.autoPlaceBet();

                // Assert
                expect(handler.cancelAutoPlay).toBeCalled();
                expect(playerActionStore.buttonState).toEqual(ButtonState.PLACE_BET);
            });
        });
    });

    describe("checkFinishedAutoPlay", () => {
        it("should return true", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isAutoPlay", { value: true, configurable: true, writable: true });
            Object.defineProperty(autoPlayStore, "skipDecreaseAutoPlayCount", { value: false, configurable: true, writable: true });
            Object.defineProperty(autoPlayStore, "roundsAutoPlay", { value: 0, configurable: true, writable: true });

            // Act
            const result = handler.checkFinishedAutoPlay();

            // Assert
            expect(result).toEqual(true);
        });

        describe("should return false", () => {
            beforeEach(() => {
                // Arrange
                Object.defineProperty(autoPlayStore, "isAutoPlay", { value: true, configurable: true, writable: true });
                Object.defineProperty(autoPlayStore, "skipDecreaseAutoPlayCount", { value: false, configurable: true, writable: true });
                Object.defineProperty(autoPlayStore, "roundsAutoPlay", { value: 0, configurable: true, writable: true });
            });

            it("when isAutoPlay false", () => {
                // Arrange
                Object.defineProperty(autoPlayStore, "isAutoPlay", { value: false, configurable: true, writable: true });

                // Act
                const result = handler.checkFinishedAutoPlay();

                // Assert
                expect(result).toEqual(false);
            });

            it("when skipDecreaseAutoPlayCount true", () => {
                // Arrange
                Object.defineProperty(autoPlayStore, "skipDecreaseAutoPlayCount", { value: true, configurable: true, writable: true });

                // Act
                const result = handler.checkFinishedAutoPlay();

                // Assert
                expect(result).toEqual(false);
            });

            it("when roundsAutoPlay > 0", () => {
                // Arrange
                Object.defineProperty(autoPlayStore, "roundsAutoPlay", { value: 1, configurable: true, writable: true });

                // Act
                const result = handler.checkFinishedAutoPlay();

                // Assert
                expect(result).toEqual(false);
            });
        });
    });

    describe("openAutoPlayPopup", () => {
        it("should set autoPlayStore.isOpenAutoPlayPopup to true", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isOpenAutoPlayPopup", { value: false, configurable: true, writable: true });

            // Act
            handler.openAutoPlayPopup();

            // Assert
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(true);
        });

        it("should set autoPlayStore.selectedRoundOnPopup to autoPlayStore.roundConfirmedOnPopup when autoPlayStore.roundConfirmedOnPopup > 0", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "roundConfirmedOnPopup", { value: 10, configurable: true, writable: true });

            // Act
            handler.openAutoPlayPopup();

            // Assert
            expect(autoPlayStore.selectedRoundOnPopup).toEqual(autoPlayStore.roundConfirmedOnPopup);
        });

        it("should set autoPlayStore.selectedRoundOnPopup to default value when autoPlayStore.roundConfirmedOnPopup === 0", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "roundConfirmedOnPopup", { value: 0, configurable: true, writable: true });

            // Act
            handler.openAutoPlayPopup();

            // Assert
            expect(autoPlayStore.selectedRoundOnPopup).toEqual(autoPlayStore.roundsList[0]);
        });
    });

    describe("clickAutoPlay", () => {
        beforeEach(() => {
            handler.openAutoPlayPopup = jest.fn();
            handler.cancelAutoPlay = jest.fn();
            handler.resetButtonState = jest.fn();
        });
        it("should call openAutoPlayPopup when isAutoPlay false, and isValidBet return true", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isAutoPlay", { value: false, configurable: true, writable: true });
            handler.isValidBet = jest.fn(() => true);

            // Act
            handler.clickAutoPlay();

            // Assert
            expect(handler.openAutoPlayPopup).toBeCalled();
        });

        describe("should call cancelAutoPlay and resetButtonState ", () => {
            beforeEach(() => {
                // Arrange
                Object.defineProperty(autoPlayStore, "isAutoPlay", { value: false, configurable: true, writable: true });
                handler.isValidBet = jest.fn(() => true);
            });
            it("when isAutoPlay true", () => {
                // Arrange
                Object.defineProperty(autoPlayStore, "isAutoPlay", { value: true, configurable: true, writable: true });

                // Act
                handler.clickAutoPlay();

                // Assert
                expect(handler.cancelAutoPlay).toBeCalled();
                expect(handler.resetButtonState).toBeCalled();
            });

            it("when isValidBet return false", () => {
                // Arrange
                handler.isValidBet = jest.fn(() => false);

                // Act
                handler.clickAutoPlay();

                // Assert
                expect(handler.cancelAutoPlay).toBeCalled();
                expect(handler.resetButtonState).toBeCalled();
            });
        });
    });

    describe("cancelAutoPlay", () => {
        beforeEach(() => {
            handler.updateAutoPlayRounds = jest.fn();
        });
        it("should set autoPlayStore.isAutoPlay to false", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isAutoPlay", { value: true, configurable: true, writable: true });

            // Act
            handler.cancelAutoPlay();

            // Assert
            expect(autoPlayStore.isAutoPlay).toEqual(false);
        });

        it("should call updateAutoPlayRounds with 0", () => {
            // Act
            handler.cancelAutoPlay();

            // Assert
            expect(handler.updateAutoPlayRounds).toBeCalledWith(0);
        });
    });

    describe("cancelEarlyBetAndAutoPlay", () => {
        beforeEach(() => {
            handler.cancelAutoPlay = jest.fn();
        });
        it("should set earlyBetStore.earlyBetEnable to false", () => {
            // Arrange
            Object.defineProperty(earlyBetStore, "earlyBetEnable", { value: true, configurable: true, writable: true });

            // Act
            handler.cancelEarlyBetAndAutoPlay();

            // Assert
            expect(earlyBetStore.earlyBetEnable).toEqual(false);
        });

        it("should call cancelAutoPlay", () => {
            // Act
            handler.cancelEarlyBetAndAutoPlay();

            // Assert
            expect(handler.cancelAutoPlay).toBeCalled();
        });
    });

    describe("closeAutoPlayPopup", () => {
        it("should set earlyBetStore.earlyBetEnable to false", () => {
            // Arrange
            Object.defineProperty(autoPlayStore, "isOpenAutoPlayPopup", { value: true, configurable: true, writable: true });

            // Act
            handler.closeAutoPlayPopup();

            // Assert
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(false);
        });
    });

    describe("isValidBet", () => {
        beforeEach(() => {
            handler["showNotEnoughMoney"] = jest.fn();
            handler["showMsgMinBet"] = jest.fn();
        });
        describe("when NOT enough money", () => {
            beforeEach(() => {
                handler["isEnoughMoney"] = jest.fn(() => false);
            });
            it("should call showNotEnoughMoney", () => {
                // Arrange

                // Act
                handler.isValidBet();

                // Assert
                expect(handler["showNotEnoughMoney"]).toBeCalled();
            });

            it("should return false", () => {
                // Arrange

                // Act
                const result = handler.isValidBet();

                // Assert
                expect(result).toEqual(false);
            });
        });

        describe("when enough money", () => {
            beforeEach(() => {
                handler["isEnoughMoney"] = jest.fn(() => true);
            });
            describe("when amount NOT greater than min bet", () => {
                beforeEach(() => {
                    Object.defineProperty(betInputStore, "isAmountGreaterMinBet", { value: false, configurable: true, writable: true });
                });
                it("should call showMsgMinBet", () => {
                    // Arrange

                    // Act
                    const result = handler.isValidBet();

                    // Assert
                    expect(handler["showMsgMinBet"]).toBeCalled();
                });

                it("should return false", () => {
                    // Arrange

                    // Act
                    const result = handler.isValidBet();

                    // Assert
                    expect(result).toEqual(false);
                });
            });

            describe("when amount greater than min bet", () => {
                beforeEach(() => {
                    Object.defineProperty(betInputStore, "isAmountGreaterMinBet", { value: true, configurable: true, writable: true });
                });

                it("should return true", () => {
                    // Arrange

                    // Act
                    const result = handler.isValidBet();

                    // Assert
                    expect(result).toEqual(true);
                });
            });
        });
    });

    describe("confirmRoundAndStart", () => {
        beforeEach(() => {
            handler.isValidBet = jest.fn();
            handler.updateStatusLatestRoundAccepted = jest.fn();
            handler.handleDecreaseRoundAtConfirm = jest.fn();
            handler.cancelAutoPlay = jest.fn();
        });

        it("should set autoPlayStore.roundsAutoPlay by autoPlayStore.selectedRoundOnPopup", () => {
            // Arrange
            autoPlayStore.roundsAutoPlay = 0;
            autoPlayStore.selectedRoundOnPopup = 5;

            // Act
            handler.confirmRoundAndStart();

            // Assert
            expect(autoPlayStore.roundsAutoPlay).toEqual(autoPlayStore.selectedRoundOnPopup);
        });

        it("should set autoPlayStore.roundConfirmedOnPopup by autoPlayStore.selectedRoundOnPopup", () => {
            // Arrange
            autoPlayStore.roundConfirmedOnPopup = 0;
            autoPlayStore.selectedRoundOnPopup = 5;

            // Act
            handler.confirmRoundAndStart();

            // Assert
            expect(autoPlayStore.roundConfirmedOnPopup).toEqual(autoPlayStore.selectedRoundOnPopup);
        });

        it("should set autoPlayStore.isOpenAutoPlayPopup by false", () => {
            // Arrange
            autoPlayStore.isOpenAutoPlayPopup = true;

            // Act
            handler.confirmRoundAndStart();

            // Assert
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(false);
        });

        describe("when isValidBet return true", () => {
            beforeEach(() => {
                handler.isValidBet = jest.fn(() => true);
            });
            it("should set autoPlayStore.isAutoPlay by true", () => {
                // Arrange
                autoPlayStore.isAutoPlay = false;

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(autoPlayStore.isAutoPlay).toEqual(true);
            });

            it("should call updateStatusLatestRoundAccepted", () => {
                // Arrange

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(handler.updateStatusLatestRoundAccepted).toBeCalled();
            });
            it("should call handleDecreaseRoundAtConfirm", () => {
                // Arrange

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(handler.handleDecreaseRoundAtConfirm).toBeCalled();
            });
        });
        describe("when isValidBet return false", () => {
            beforeEach(() => {
                handler.isValidBet = jest.fn(() => false);
            });

            it("should call cancelAutoPlay", () => {
                // Arrange

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(handler.cancelAutoPlay).toBeCalled();
            });
        });
    });

    describe("handleDecreaseRoundAtConfirm", () => {
        beforeEach(() => {
            crashBetHandler.autoPlaceBet = jest.fn();
            handler.updateAutoPlayRounds = jest.fn();
            handler.autoEnableEarlyBet = jest.fn();
        });

        describe("when isPlacingBet and playerActionStore.buttonState = ButtonState.PLACE_BET", () => {
            beforeEach(() => {
                Object.defineProperty(roundTimeStore, "isPlacingBet", { value: true, configurable: true, writable: true });
                playerActionStore.buttonState = ButtonState.PLACE_BET;
                autoPlayStore.roundsAutoPlay = 1;
            });
            it("should call crashBetHandler.autoPlaceBet", () => {
                // Arrange

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(crashBetHandler.autoPlaceBet).toBeCalled();
            });

            it("should call updateAutoPlayRounds", () => {
                // Arrange

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(handler.updateAutoPlayRounds).toBeCalledWith(autoPlayStore.roundsAutoPlay - 1);
            });
        });

        describe("when playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND", () => {
            it("should call autoEnableEarlyBet", () => {
                // Arrange
                playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND;

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(handler.autoEnableEarlyBet).toBeCalled();
            });
        });

        describe("when playerActionStore.buttonState = ButtonState.CANCEL_BET", () => {
            it("should set autoPlayStore.skipDecreaseAutoPlayCount to true", () => {
                // Arrange
                autoPlayStore.skipDecreaseAutoPlayCount = false;
                playerActionStore.buttonState = ButtonState.CANCEL_BET;

                // Act
                handler.confirmRoundAndStart();

                // Assert
                expect(autoPlayStore.skipDecreaseAutoPlayCount).toEqual(true);
            });
        });
    });

    describe("autoEnableEarlyBet", () => {
        beforeEach(() => {
            handler.changeEarlyBetButton = jest.fn();
        });
        it("should call changeEarlyBetButton with true", () => {
            // Act
            handler.autoEnableEarlyBet();

            // Assert
            expect(handler.changeEarlyBetButton).toBeCalledWith(true);
        });

        it("should set skipDecreaseAutoPlayCount property of autoPlayStore to true", () => {
            // Arrange
            autoPlayStore.skipDecreaseAutoPlayCount = false;

            // Act
            handler.autoEnableEarlyBet();

            // Assert
            expect(autoPlayStore.skipDecreaseAutoPlayCount).toBe(true);
        });
        it("should call updateAutoPlayRounds method of autoPlayStore with roundsAutoPlay - 1 argument", () => {
            // Arrange
            autoPlayStore.roundsAutoPlay = 5;
            handler.updateAutoPlayRounds = jest.fn();

            // Act
            handler.autoEnableEarlyBet();

            // Assert
            expect(handler.updateAutoPlayRounds).toBeCalledWith(4);
        });
    });

    describe("clickEarlyBet", () => {
        beforeEach(() => {
            handler.changeEarlyBetButton = jest.fn();
            handler.cancelAutoPlay = jest.fn();
        });
        describe("when button state is 'BET_NEXT_ROUND' ", () => {
            beforeEach(() => {
                playerActionStore.buttonState = ButtonState.BET_NEXT_ROUND;
            });
            describe("Bet is invalid", () => {
                it("should call changeEarlyBetButton with true", () => {
                    // Arrange
                    const enable = true;
                    handler.isValidBet = jest.fn().mockReturnValue(true);

                    // Act
                    handler.clickEarlyBet();

                    // Assert
                    expect(handler.changeEarlyBetButton).toBeCalledWith(enable);
                    expect(handler.cancelAutoPlay).not.toBeCalled();
                });
            });

            describe("Bet is invalid", () => {
                // Clicking early bet button when button state is 'BET_NEXT_ROUND' and bet is invalid
                it("should call changeEarlyBetButton with true and cancelAutoPlay", () => {
                    // Arrange
                    const enable = true;
                    handler.isValidBet = jest.fn().mockReturnValue(false);

                    // Act
                    handler.clickEarlyBet();

                    // Assert
                    expect(handler.changeEarlyBetButton).not.toBeCalled();
                    expect(handler.cancelAutoPlay).not.toBeCalled();
                });
            });
        });

        describe("when button state is not 'BET_NEXT_ROUND", () => {
            // Clicking early bet button when button state is not 'BET_NEXT_ROUND'
            it("should call changeEarlyBetButton with false and cancelAutoPlay", () => {
                // Arrange
                const enable = false;
                playerActionStore.buttonState = ButtonState.CANCEL_BET;

                // Act
                handler.clickEarlyBet();

                // Assert
                expect(handler.changeEarlyBetButton).toBeCalledWith(enable);
                expect(handler.cancelAutoPlay).toBeCalled();
            });
        });
    });

    describe("changeEarlyBetButton", () => {
        it("should set earlyBetStore.earlyBetEnable true", () => {
            // Arrange
            earlyBetStore.earlyBetEnable = false;

            // Act
            handler.changeEarlyBetButton(true);

            // Assert
            expect(earlyBetStore.earlyBetEnable).toEqual(true);
            expect(playerActionStore.buttonState).toEqual(ButtonState.CANCEL_BET);
        });
        it("should set earlyBetStore.earlyBetEnable false", () => {
            // Arrange
            earlyBetStore.earlyBetEnable = true;

            // Act
            handler.changeEarlyBetButton(false);

            // Assert
            expect(earlyBetStore.earlyBetEnable).toEqual(false);
            expect(playerActionStore.buttonState).toEqual(ButtonState.BET_NEXT_ROUND);
        });
    });
});
