import { SSOResponse } from "sc-user-service-client/dist/auth";
import { AuthStore } from "../../../src/auth";
import { StorageManager, localStorageKeys } from "../../../src/shared/utils/storage-manager";

const now = new Date("2023-01-01");
jest.useFakeTimers().setSystemTime(now);
jest.mock("../../../src/shared/utils/storage-manager", () => ({
    StorageManager: {},
    localStorageKeys: { session: "session-key" },
}));

describe("AuthStore tests", () => {
    describe("setAuthSSOStore", () => {
        it("should set store sso", () => {
            // arrange
            const store = new AuthStore();
            const ssoResponse = {
                isAuthenticated: true,
                username: "user",
                language: "vi-VN",
                ss: "session",
                system: 1,
                memberName: "name",
                isUM: false,
            };

            // act
            store.setAuthSSOStore(ssoResponse as SSOResponse);

            // assert
            expect(store.isAuthenticated).toBe(ssoResponse.isAuthenticated);
            expect(store.username).toBe(ssoResponse.username);
            expect(store.language).toBe(ssoResponse.language);
            expect(store.session).toBe(ssoResponse.ss);
            expect(store.system).toBe(ssoResponse.system);
            expect(store.memberName).toBe(ssoResponse.memberName);
            expect(store.ssoTime).toEqual(now);
        });
    });

    describe("getSessionInfo", () => {
        it("should return session info", () => {
            // arrange
            const store = new AuthStore();
            store.isAuthenticated = true;
            store.username = "username";
            store.language = "vi-VN";
            store.session = "session";
            store.system = 1;
            store.memberName = "memberName";
            store.ssoTime = now;
            const expected = {
                isAuthenticated: store.isAuthenticated,
                username: store.username,
                language: store.language,
                session: store.session,
                system: store.system,
                memberName: store.memberName,
                ssoTime: store.ssoTime,
            };

            // act
            const actual = store.getSessionInfo();

            // assert
            expect(actual).toEqual(expected);
        });
    });

    describe("signOut", () => {
        it("should set reset username, session, isAuthenticated and set session timeout", () => {
            // arrange
            // @ts-ignore
            StorageManager.remove = jest.fn();
            const store = new AuthStore();
            store.isAuthenticated = true;
            store.username = "username";
            store.session = "session";

            // act
            store.signOut();

            // assert
            expect(store.isAuthenticated).toBe(false);
            expect(store.username).toBeNull();
            expect(store.session).toBeNull();
        });

        it("should call remove StorageManager", async () => {
            // arrange
            // @ts-ignore
            StorageManager.remove = jest.fn();
            const store = new AuthStore();

            // act
            store.signOut();

            // assert
            expect(StorageManager.remove).toHaveBeenCalledWith(localStorageKeys.session);
        });
    });
});
