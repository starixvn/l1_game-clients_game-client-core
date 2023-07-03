import { AuthStore } from "../../../../src/auth";
import { GameServiceMessage } from "../../../../src/shared";
import { AccountClosedHandlers } from "./../../../../src/game/account-closed/account-closed-handlers";

describe("AccountClosedHandlers", () => {
    let accountClosedHandlers: AccountClosedHandlers;
    let authStore: AuthStore;

    beforeEach(() => {
        authStore = new AuthStore();
        accountClosedHandlers = new AccountClosedHandlers(authStore);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("handle", () => {
        it("should call setAccountClosed with the error code if isDisabledAccount is true", () => {
            const errorCode = "2002";
            const accountCloseInfo: GameServiceMessage.AccountClosed = {
                isDisabledAccount: true,
                errorCode: errorCode,
            };

            const setAccountClosedSpy = jest.spyOn(authStore, "setAccountClosed");

            accountClosedHandlers.handle(accountCloseInfo);

            expect(setAccountClosedSpy).toHaveBeenCalledWith(errorCode);
        });

        it("should not call setAccountClosed if isDisabledAccount is false", () => {
            const accountCloseInfo: GameServiceMessage.AccountClosed = {
                isDisabledAccount: false,
                errorCode: "2002",
            };

            const setAccountClosedSpy = jest.spyOn(authStore, "setAccountClosed");

            accountClosedHandlers.handle(accountCloseInfo);

            expect(setAccountClosedSpy).not.toHaveBeenCalled();
        });
    });
});
