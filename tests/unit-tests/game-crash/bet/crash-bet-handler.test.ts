import { stub } from "jest-auto-stub";

import { CrashBetHandler } from "../../../../src/game-crash/bet";

import { AutoCashOutStore } from "../../../../src/game-crash/auto-cash-out";
import { BetInputStore } from "../../../../src/game-crash/bet-input";
import { BetStore } from "../../../../src/game/bets";
import { GameSetting } from "../../../../src/game/game-configs/game-setting";
import { NoticeStore } from "../../../../src/game/notices";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../../../../src/game/rounds";
import { MainPlayerStore } from "../../../../src/players";
import { Translator } from "../../../../src/shared/utils/localization-manager";
import { gameSettings } from "../../container.test";
import { ConnectionHandlers, ConnectionStore } from "./../../../../src/game/connection";
import { OrientationStore } from "./../../../../src/game/orientation";

jest.mock("../../../../src/shared/utils/localization-manager", () => ({
    Translator: { translate: jest.fn(), gameTranslate: jest.fn(), commonTranslate: jest.fn().mockImplementation((key, option) => key) },
}));

describe("CrashBetHandler", () => {
    let betHandler: CrashBetHandler;

    let connectionStore: ConnectionStore;
    let betStore: BetStore;
    let mainPlayerStore: MainPlayerStore;
    let orientationStore: OrientationStore;
    let roundTimeStore: RoundTimeStore;
    let noticeStore: NoticeStore;
    let retryHandler: ConnectionHandlers.RetryGameHandler;
    let showWarningProcessingBet;
    let gameSetting: GameSetting;
    let autoCashoutStore: AutoCashOutStore;
    let betInputStore: BetInputStore;
    let roundStore: RoundStore;

    beforeAll(() => {
        noticeStore = new NoticeStore();
        mainPlayerStore = new MainPlayerStore(noticeStore);
        connectionStore = stub<ConnectionStore>();
        betStore = stub<BetStore>();
        orientationStore = new OrientationStore();
        retryHandler = stub<ConnectionHandlers.RetryGameHandler>();
        autoCashoutStore = stub<AutoCashOutStore>();
        roundStore = stub<RoundStore>();

        roundTimeStore = new RoundTimeStore(gameSettings);
        gameSetting = new GameSetting();
    });

    beforeEach(() => {
        betHandler = new CrashBetHandler(
            connectionStore,
            betStore,
            mainPlayerStore,
            orientationStore,
            roundTimeStore,
            noticeStore,
            retryHandler,
            roundStore,
            autoCashoutStore,
            betInputStore
        );

        showWarningProcessingBet = jest.spyOn(betHandler, "showWarningProcessingBet");

        connectionStore.send = jest.fn();
        noticeStore.addWarning = jest.fn();
        noticeStore.addProcessWarning = jest.fn();
        mainPlayerStore.name = "player";
        betStore.isProcessingBet = false;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("isInPhasePreventBet", () => {
        describe("when round in PLACING_BET phase", () => {
            it("should return false", () => {
                // Arrange
                roundTimeStore.roundState = ROUND_STATE.PLACING_BET;

                // Act
                const actual = betHandler.isInPhasePreventBet();

                // Assert
                expect(actual).toBe(false);
            });
        });

        describe("when round NOT in PLACING_BET phase", () => {
            it("should return true ", () => {
                // Arrange
                Translator.commonTranslate = jest.fn(() => "Place bet next round");
                roundTimeStore.roundState = ROUND_STATE.LOCKING_BET;

                // Act
                const actual = betHandler.isInPhasePreventBet();

                // Assert
                expect(actual).toEqual(true);
            });

            it("should add warning to notice store", () => {
                // Arrange
                const message = "Place bet next round";
                Translator.commonTranslate = jest.fn().mockReturnValueOnce("Place bet next round");
                roundTimeStore.roundState = ROUND_STATE.LOCKING_BET;

                // Act
                betHandler.isInPhasePreventBet();

                // Assert
                expect(noticeStore.addWarning).toBeCalledWith(message);
            });

            it("should get message_placebet_next_round", () => {
                // Arrange
                Translator.commonTranslate = jest.fn().mockReturnValueOnce("Place bet next round");
                roundTimeStore.roundState = ROUND_STATE.LOCKING_BET;

                // Act
                betHandler.isInPhasePreventBet();

                // Assert
                expect(Translator.commonTranslate).toBeCalledWith("message_placebet_next_round");
            });

            describe("when round in STARTING_ROUND phase", () => {
                it("should get message_cannot_bet", () => {
                    // Arrange
                    Translator.commonTranslate = jest.fn().mockReturnValueOnce("Place bet next round");
                    roundTimeStore.roundState = ROUND_STATE.STARTING_ROUND;

                    // Act
                    betHandler.isInPhasePreventBet();

                    // Assert
                    expect(Translator.commonTranslate).toBeCalledWith("message_cannot_bet");
                });
            });
        });
    });
});
