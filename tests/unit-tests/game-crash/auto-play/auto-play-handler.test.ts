import { stub } from "jest-auto-stub";
import { ButtonState } from "../../../../src/game-crash";
import { AutoPlayHandler } from "../../../../src/game-crash/auto-play/auto-play-handler";
import { AutoPlayStore } from "../../../../src/game-crash/auto-play/auto-play-store";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { CrashBetHandler } from "../../../../src/game-crash/bet/crash-bet-handler";
import { EarlyBetStore } from "../../../../src/game-crash/bet/early-bet-store";
import { PlayerActionStore } from "../../../../src/game-crash/player-actions/player-action-store";
import { BetStore } from "../../../../src/game/bets/bet-store";
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

    beforeAll(() => {
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
    });

    beforeEach(() => {
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
            errorStore
        );
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
});
