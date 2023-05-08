import { AppStore } from "../../../src/app/app-store";
import { AuthHandlers, AuthStore, UserService } from "../../../src/auth";
import { PlayerStore } from "../../../src/players";

import NameGenerator from "../../../src/shared/utils/name-generator";
import { StorageManager, localStorageKeys } from "../../../src/shared/utils/storage-manager";
import { siteConfigs } from "../container.test";
jest.mock("../../../src/shared/utils/name-generator");
jest.mock("../../../src/shared/utils/storage-manager", () => ({
    StorageManager: {
        get: jest.fn(),
        remove: jest.fn(),
    },
    localStorageKeys: { session: "session-key" },
}));

describe("AuthHandlers tests", () => {
    describe("Authorize", () => {
        // arrange
        const userService = new UserService(siteConfigs);
        userService.authorize = jest.fn();
        describe("when UM", () => {
            const response = { isUM: true, umInfo: {} };
            beforeEach(() => {
                // @ts-ignore
                userService.authorize.mockReturnValueOnce(response);
            });
            it("should call userService authorize with session and username from storage manager", async () => {
                // arrange
                // @ts-ignore
                StorageManager.get.mockReturnValueOnce({ session: "session", username: "username" });
                const authStore = new AuthStore();
                const playerStore = new PlayerStore();
                const appStore = new AppStore();
                appStore.setUM = jest.fn();
                const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                // act
                await handler.handle({});

                // assert
                expect(userService.authorize).toHaveBeenCalledWith("session", "username");
            });
            it("should call userService authorize with session and username from param", async () => {
                // arrange
                // @ts-ignore
                const authStore = new AuthStore();
                const playerStore = new PlayerStore();
                const appStore = new AppStore();
                appStore.setUM = jest.fn();
                const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                // act
                await handler.handle({ session: "1", username: "name" });

                // assert
                expect(userService.authorize).toHaveBeenCalledWith("1", "name");
            });
            it("should set UM in auth store with session and username from storage manager", async () => {
                // arrange
                // @ts-ignore
                StorageManager.get.mockReturnValueOnce({ session: "session", username: "username" });
                const authStore = new AuthStore();
                const playerStore = new PlayerStore();
                const appStore = new AppStore();
                appStore.setUM = jest.fn();
                const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                // act
                await handler.handle({});

                // assert
                expect(appStore.setUM).toHaveBeenCalledWith(response.umInfo);
            });
        });

        describe("when authorize unsuccessful", () => {
            const response = { isUM: false, umInfo: null, isSuccessful: false };
            beforeEach(() => {
                // @ts-ignore
                userService.authorize.mockReturnValueOnce(response);
            });
            it("should call signOut", async () => {
                // arrange
                const authStore = new AuthStore();
                const playerStore = new PlayerStore();
                const appStore = new AppStore();
                const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                signOutHandler.handle = jest.fn();
                const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                // act
                await handler.handle({ session: "session", username: "username" });

                // assert
                expect(signOutHandler.handle).toHaveBeenCalled();
            });
        });

        describe("when authorize successfully", () => {
            describe("when auth store isDirectMode false", () => {
                const authStore = new AuthStore();
                const appStore = new AppStore();
                appStore.isDirectMode = false;
                it("should set isAuthorized", async () => {
                    // arrange
                    const response = { isUM: false, umInfo: null, isSuccessful: true, authorized: true };
                    // @ts-ignore
                    userService.authorize.mockReturnValueOnce(response);
                    const playerStore = new PlayerStore();
                    const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                    const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                    // act
                    await handler.handle({ session: "session", username: "username" });

                    // assert
                    expect(authStore.isAuthorized).toBe(response.authorized);
                });
                it("should not set authorize store in player when user is null", async () => {
                    // arrange
                    const response = { isUM: false, umInfo: null, isSuccessful: true, authorized: false, user: null };
                    // @ts-ignore
                    userService.authorize.mockReturnValueOnce(response);
                    const playerStore = new PlayerStore();
                    playerStore.setAuthorizeStore = jest.fn();
                    const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                    const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                    // act
                    await handler.handle({ session: "session", username: "username" });

                    // assert
                    expect(playerStore.setAuthorizeStore).not.toHaveBeenCalled();
                });
                it("should set authorize store in player when user is not null", async () => {
                    // arrange
                    const response = { isUM: false, umInfo: null, isSuccessful: true, authorized: false, user: { UID: 1 } };
                    // @ts-ignore
                    userService.authorize.mockReturnValueOnce(response);
                    const playerStore = new PlayerStore();
                    playerStore.setAuthorizeStore = jest.fn();
                    const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                    const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                    // act
                    await handler.handle({ session: "session", username: "username" });

                    // assert
                    expect(playerStore.setAuthorizeStore).toHaveBeenCalledWith(response.user);
                });
            });

            describe("when auth store isDirectMode true", () => {
                beforeEach(() => {
                    NameGenerator.generateName = jest.fn().mockReturnValueOnce("autoGeneratedNickname");
                });
                it("should create auto nickname", async () => {
                    // arrange
                    const response = { isUM: false, umInfo: null, isSuccessful: true, authorized: false };
                    // @ts-ignore
                    userService.authorize.mockReturnValueOnce(response);
                    userService.signName = jest.fn().mockReturnValue({ authorized: true });
                    const authStore = new AuthStore();
                    const appStore = new AppStore();
                    appStore.isDirectMode = true;
                    const playerStore = new PlayerStore();
                    playerStore.setAuthorizeStore = jest.fn();
                    const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                    const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                    // act
                    await handler.handle({ session: "session", username: "username" });

                    // assert
                    expect(userService.signName).toHaveBeenCalledWith("session", "username", "autoGeneratedNickname");
                });
                it("should set isAuthorized in authStore when create nickname successfully", async () => {
                    // arrange
                    const response = { isUM: false, umInfo: null, isSuccessful: true, authorized: false };
                    // @ts-ignore
                    userService.authorize.mockReturnValueOnce(response);
                    userService.signName = jest.fn().mockReturnValue({ authorized: true });
                    const authStore = new AuthStore();
                    const appStore = new AppStore();
                    appStore.isDirectMode = true;
                    const playerStore = new PlayerStore();
                    playerStore.setAuthorizeStore = jest.fn();
                    const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                    const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                    // act
                    await handler.handle({ session: "session", username: "username" });

                    // assert
                    expect(authStore.isAuthorized).toBe(true);
                });
                it("should setAuthorizeStore in playerStore when create nickname successfully", async () => {
                    // arrange
                    const response = { isUM: false, umInfo: null, isSuccessful: true, authorized: false };
                    // @ts-ignore
                    userService.authorize.mockReturnValueOnce(response);
                    userService.signName = jest.fn().mockReturnValue({ authorized: true, user: { UID: 1 } });
                    const authStore = new AuthStore();
                    const appStore = new AppStore();
                    appStore.isDirectMode = true;
                    const playerStore = new PlayerStore();
                    playerStore.setAuthorizeStore = jest.fn();
                    const signOutHandler = new AuthHandlers.SignOut(appStore, authStore);
                    const handler = new AuthHandlers.Authorize(authStore, appStore, playerStore, userService, signOutHandler);

                    // act
                    await handler.handle({ session: "session", username: "username" });

                    // assert
                    expect(playerStore.setAuthorizeStore).toHaveBeenCalledWith({ UID: 1 });
                });
            });
        });
    });

    describe("SessionTimeout", () => {
        let reCheckIn: AuthHandlers.ReCheckIn;
        const mockSession = "mockSession";
        const mockUsername = "mockUsername";
        const siteConfigs = {
            isDev: true,
            systemType: "SC1",
            ssl: false,
            serverDomainMapper: {
                localhost: "localhost:5002",
            },
            subDomain: "",
            env: "LOCAL",
            subGuideDomain: "l1-guide",
            enableMsgpackParserAllGames: false,
            enableMsgpackParserOnNotification: false,
            userServiceUrlDev: "http://localhost:3000/user",
            websocket: {
                proxyPath: "sedie",
                route: "",
            },
        };

        let authStore: AuthStore;
        let triggerRecheckIn: AuthHandlers.TriggerRecheckIn;
        let userService: UserService;
        let player: PlayerStore;
        let sessionTimeout: AuthHandlers.SessionTimeout;
        let signOut: AuthHandlers.SignOut;
        let appStore: AppStore;

        beforeEach(() => {
            authStore = new AuthStore();
            appStore = new AppStore();
            userService = new UserService(siteConfigs);
            player = new PlayerStore();
            signOut = new AuthHandlers.SignOut(appStore, authStore);
            reCheckIn = new AuthHandlers.ReCheckIn(authStore, player, userService, signOut);
            triggerRecheckIn = new AuthHandlers.TriggerRecheckIn(reCheckIn, signOut);
            sessionTimeout = new AuthHandlers.SessionTimeout(triggerRecheckIn);
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        test("handle clears interval and removes session from local storage", () => {
            const clearIntervalSpy = jest.spyOn(AuthHandlers.TriggerRecheckIn.prototype, "clearInterval");
            StorageManager.remove = jest.fn();
            sessionTimeout.handle();

            expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
            expect(StorageManager.remove).toHaveBeenCalledWith(localStorageKeys.session);
        });
    });
});
