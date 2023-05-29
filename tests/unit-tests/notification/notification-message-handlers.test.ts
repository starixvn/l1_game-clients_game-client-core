import { stub } from "jest-auto-stub";
import { AuthHandlers } from "../../../src/auth/auth-handlers";
import { NotificationMessageHandlers, NotificationStore } from "../../../src/notification";
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
});
