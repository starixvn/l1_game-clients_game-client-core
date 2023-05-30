import { BetHandler, BetStore } from "../../../../src/game/bets";
import { NoticeStore } from "../../../../src/game/notices";
import { ROUND_STATE, RoundTimeStore } from "../../../../src/game/rounds";
import { PlayerStore } from "../../../../src/players";
import { GameClientEmitMessage, Mediator } from "../../../../src/shared";
import { gameSettings } from "../../container.test";
import { ConnectionStore } from "./../../../../src/game/connection";
import { OrientationStore } from "./../../../../src/game/orientation";

jest.mock("../../../../src/shared/l10n", () => ({
    l10n: jest.fn(),
}));
import { l10n } from "../../../../src/shared/l10n";

describe("BetHandler", () => {
    let connectionStore: ConnectionStore;
    let betStore: BetStore;
    let playerStore: PlayerStore;
    let orientationStore: OrientationStore;
    let roundTimeStore: RoundTimeStore;
    let noticeStore: NoticeStore;
    let betHandler: BetHandler;
    let betChoice: string;
    let showWarningProcessingBet;

    beforeAll(() => {
        playerStore = new PlayerStore();
        connectionStore = new ConnectionStore(new Mediator(), gameSettings);
        betStore = new BetStore();
        orientationStore = new OrientationStore();
        noticeStore = new NoticeStore();
        roundTimeStore = new RoundTimeStore(gameSettings);
    });

    beforeEach(() => {
        betHandler = new BetHandler(connectionStore, betStore, playerStore, orientationStore, roundTimeStore, noticeStore);
        showWarningProcessingBet = jest.spyOn(betHandler, "showWarningProcessingBet");

        betChoice = "even";
        connectionStore.send = jest.fn();
        noticeStore.addWarning = jest.fn();
        playerStore.name = "player";
        playerStore.balance = 100;
        playerStore.scoin = 100;
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
            playerStore.balance = 100;
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
            playerStore.scoin = 100;
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
            playerStore.scoin = 100;
            playerStore.balance = 100;
            betStore.amount = 50;

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).not.toBeCalled();
            expect(connectionStore.send).toBeCalledWith(GameClientEmitMessage.Bet.eventName, {
                m: orientationStore.m,
                username: playerStore.name,
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
