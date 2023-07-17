import { stub } from "jest-auto-stub";
import { AuthHandlers } from "../../../src/auth/auth-handlers";
import { JackpotWinnerStore, NotificationMessageHandlers, NotificationStore } from "../../../src/notification";
import { NotificationServiceMessage } from "../../../src/shared";

describe("NotificationMessageHandlers", () => {
    describe("session timeout", () => {
        let signOutHandler: AuthHandlers.SignOut;
        let notificationStore: NotificationStore;
        let sessionTimeoutHandler: NotificationMessageHandlers.SessionTimeout;
        beforeEach(() => {
            signOutHandler = stub<AuthHandlers.SignOut>();
            notificationStore = stub<NotificationStore>();
            notificationStore.connection = {
                disconnect: jest.fn(),
            };
            sessionTimeoutHandler = new NotificationMessageHandlers.SessionTimeout(signOutHandler, notificationStore);
        });

        it("has name is equal notifyTimeout", () => {
            // assert
            expect(sessionTimeoutHandler.name).toEqual(NotificationServiceMessage.sessionTimeoutEventName);
        });

        describe("handle", () => {
            it("should call disconnect connection of notificationStore", () => {
                // act
                sessionTimeoutHandler.handle();

                // assert
                expect(notificationStore.connection.disconnect).toHaveBeenCalled();
            });

            it("should call sign out", () => {
                // act
                sessionTimeoutHandler.handle();

                // assert
                expect(signOutHandler.handle).toHaveBeenCalled();
            });
        });
    });

    describe("notify jackpot winner", () => {
        let jackpotWinnerStore: JackpotWinnerStore;
        let handler: NotificationMessageHandlers.NotifyJackpotWinner;
        beforeEach(() => {
            jackpotWinnerStore = stub<JackpotWinnerStore>();
            handler = new NotificationMessageHandlers.NotifyJackpotWinner(jackpotWinnerStore);
        });

        it("has name is equal notifyTimeout", () => {
            // assert
            expect(handler.name).toEqual(NotificationServiceMessage.JackpotWinner.eventName);
        });

        describe("handle", () => {
            it("should set jackpotWinner of jackpotWinnerStore", () => {
                // arrange
                const jackpotWinner = {
                    gameId: 1,
                    winnerName: "player1",
                    amount: 100,
                    pool: 1,
                };

                // act
                handler.handle(jackpotWinner);

                // assert
                expect(jackpotWinnerStore.setJackpotWinner).toHaveBeenCalledWith(jackpotWinner);
            });
        });
    });
});
