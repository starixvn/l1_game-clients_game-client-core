import { stub } from "jest-auto-stub";
import { BetHandler, BetStore } from "../../../../src/game/bets";
import { NoticeStore } from "../../../../src/game/notices";
import { ROUND_STATE, RoundTimeStore } from "../../../../src/game/rounds";
import { MainPlayerStore } from "../../../../src/players";
import { GameClientEmitMessage } from "../../../../src/shared";
import { l10n } from "../../../../src/shared/l10n";
import { gameSettings } from "../../container.test";
import { ConnectionStore } from "./../../../../src/game/connection";
import { OrientationStore } from "./../../../../src/game/orientation";

jest.mock("../../../../src/shared/l10n", () => ({
    l10n: jest.fn(),
}));

describe("BetHandler", () => {
    let connectionStore: ConnectionStore;
    let betStore: BetStore;
    let mainPlayerStore: MainPlayerStore;
    let orientationStore: OrientationStore;
    let roundTimeStore: RoundTimeStore;
    let noticeStore: NoticeStore;
    let betHandler: BetHandler;
    let betChoice: string;
    let showWarningProcessingBet;

    beforeAll(() => {
        mainPlayerStore = new MainPlayerStore();
        connectionStore = stub<ConnectionStore>();
        betStore = new BetStore();
        orientationStore = new OrientationStore();
        noticeStore = new NoticeStore();
        roundTimeStore = new RoundTimeStore(gameSettings);
    });

    beforeEach(() => {
        betHandler = new BetHandler(connectionStore, betStore, mainPlayerStore, orientationStore, roundTimeStore, noticeStore);
        showWarningProcessingBet = jest.spyOn(betHandler, "showWarningProcessingBet");

        betChoice = "even";
        connectionStore.send = jest.fn();
        noticeStore.addWarning = jest.fn();
        mainPlayerStore.name = "player";
        mainPlayerStore.balance = 100;
        mainPlayerStore.scoin = 100;
        betStore.isProcessingBet = false;
        roundTimeStore.roundState = ROUND_STATE.PLACING_BET;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handle", () => {
        it("should show warning, please bet next round, when locking bet", () => {
            // Arrange
            roundTimeStore.roundState = ROUND_STATE.LOCKING_BET;
            l10n.t = jest.fn(() => "Please wait for the next round.");

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).toBeCalledWith("Please wait for the next round.");
            expect(showWarningProcessingBet).not.toBeCalled();
            expect(connectionStore.send).not.toBeCalled();
        });

        it("should show warning, can not bet at the moment, when starting round", () => {
            // Arrange
            roundTimeStore.roundState = ROUND_STATE.STARTING_ROUND;
            l10n.t = jest.fn(() => "Cannot bet at the moment. Please wait for a few seconds.");

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).toBeCalledWith("Cannot bet at the moment. Please wait for a few seconds.");
            expect(showWarningProcessingBet).not.toBeCalled();
            expect(connectionStore.send).not.toBeCalled();
        });

        it("should showWarningProcessingBet when isProcessingBet true", () => {
            // Arrange
            betStore.isProcessingBet = true;

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(showWarningProcessingBet).toBeCalled();
            expect(connectionStore.send).not.toBeCalled();
        });

        it("should show error notice when amount is greater than balance", () => {
            // Arrange
            mainPlayerStore.balance = 100;
            betStore.amount = 200;
            betStore.freebetEnabled = false;
            l10n.t = jest.fn(() => "Your account has insufficient funds.");

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).toBeCalledWith("Your account has insufficient funds.");
            expect(connectionStore.send).not.toBeCalled();
        });

        it("should show error notice when freebet is enabled and scoin is less than amount", () => {
            // Arrange
            mainPlayerStore.scoin = 100;
            betStore.amount = 200;
            betStore.freebetEnabled = true;
            l10n.t = jest.fn(() => "Not enough Scoin to place bet.");

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).toBeCalledWith("Not enough Scoin to place bet.");
            expect(connectionStore.send).not.toBeCalled();
        });

        it("should send bet data to server when amount is less than scoin or balance ", () => {
            // Arrange
            mainPlayerStore.scoin = 100;
            mainPlayerStore.balance = 100;
            betStore.amount = 50;

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).not.toBeCalled();
            expect(connectionStore.send).toBeCalledWith(GameClientEmitMessage.Bet.eventName, {
                m: orientationStore.m,
                username: mainPlayerStore.name,
                betChoice,
                amount: betStore.amount,
                freeBet: betStore.freebetEnabled,
            });
        });
    });

    describe("showWarningProcessingBet", () => {
        it("should showWarningProcessingBet when isProcessingBet true", () => {
            // Arrange
            l10n.t = jest.fn(() => "Data are being processed. Please wait...");
            const text = "Data are being processed. Please wait...";

            // Act
            betHandler.showWarningProcessingBet();

            // Assert
            expect(noticeStore.addWarning).toBeCalledWith(text);
        });
    });

    describe("isInPhasePreventBet", () => {
        it("should return false when round state is placing bet", () => {
            // Arrange
            roundTimeStore.roundState = ROUND_STATE.PLACING_BET;

            // Act
            const value = betHandler.isInPhasePreventBet();

            // Assert
            expect(value).toEqual(false);
        });

        it("should return true when round state is locking bet", () => {
            // Arrange
            roundTimeStore.roundState = ROUND_STATE.LOCKING_BET;

            // Act
            const value = betHandler.isInPhasePreventBet();

            // Assert
            expect(value).toEqual(true);
        });
    });
});
