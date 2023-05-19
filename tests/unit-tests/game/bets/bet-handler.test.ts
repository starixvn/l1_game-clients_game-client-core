import { BetHandler, BetStore } from "../../../../src/game/bets";
import { NoticeStore } from "../../../../src/game/notices";
import { PlayerStore } from "../../../../src/players";
import { GameClientEmitMessage, Mediator } from "../../../../src/shared";
import { gameSettings } from "../../container.test";
import { ConnectionStore } from "./../../../../src/game/connection";
import { OrientationStore } from "./../../../../src/game/orientation";

describe("BetHandler it", () => {
    let connectionStore: ConnectionStore;
    let betStore: BetStore;
    let playerStore: PlayerStore;
    let orientationStore: OrientationStore;
    let noticeStore: NoticeStore;
    let betHandler: BetHandler;
    let betChoice: string;

    beforeAll(() => {
        playerStore = new PlayerStore();
        connectionStore = new ConnectionStore(new Mediator(), gameSettings);
        betStore = new BetStore();
        orientationStore = new OrientationStore();
        noticeStore = new NoticeStore();
    });

    beforeEach(() => {
        betHandler = new BetHandler(connectionStore, betStore, playerStore, orientationStore, noticeStore);
        betChoice = "even";
        connectionStore.send = jest.fn();
        noticeStore.addWarning = jest.fn();
        playerStore.name = "player";
        playerStore.balance = 100;
        playerStore.scoin = 100;
        betStore.isProcessingBet = false;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handle", () => {
        it("should showWarningProcessingBet when isProcessingBet true", () => {
            // Arrange
            betStore.isProcessingBet = true;
            const showWarningProcessingBet = jest.spyOn(betHandler, "showWarningProcessingBet");

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(showWarningProcessingBet).toBeCalled();
            expect(connectionStore.send).not.toHaveBeenCalled();
        });

        it("should show error notice when amount is greater than balance", () => {
            // Arrange
            playerStore.balance = 100;
            betStore.amount = 200;
            betStore.freebetEnabled = false;

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).toHaveBeenCalledWith("Your account has insufficient funds.");
            expect(connectionStore.send).not.toHaveBeenCalled();
        });

        it("should show error notice when freebet is enabled and scoin is less than amount", () => {
            // Arrange
            playerStore.scoin = 100;
            betStore.amount = 200;
            betStore.freebetEnabled = true;

            // Act
            betHandler.handle(betChoice);

            // Assert
            expect(noticeStore.addWarning).toHaveBeenCalledWith("Not enough Scoin to place bet.");
            expect(connectionStore.send).not.toHaveBeenCalled();
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
            expect(connectionStore.send).toHaveBeenCalledWith(GameClientEmitMessage.Bet.eventName, {
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
            const text = "Data are being processed. Please wait...";
            // Act
            betHandler.showWarningProcessingBet();

            // Assert
            expect(noticeStore.addWarning).toHaveBeenCalledWith(text);
        });
    });
});
