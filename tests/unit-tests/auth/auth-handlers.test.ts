import { AuthHandlers, AuthStore, UserService } from "../../../src/auth";
import { PlayerStore } from "../../../src/players";
import { StorageManager, localStorageKeys } from "../../../src/shared/utils";

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

    beforeEach(() => {
        authStore = new AuthStore();
        userService = new UserService(siteConfigs);
        player = new PlayerStore();
        reCheckIn = new AuthHandlers.ReCheckIn(authStore, player, userService);
        triggerRecheckIn = new AuthHandlers.TriggerRecheckIn(reCheckIn, authStore);
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
        const removeItemSpy = jest.spyOn(StorageManager, "remove");
        sessionTimeout.handle();

        expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
        expect(removeItemSpy).toHaveBeenCalledWith(localStorageKeys.session);
    });
});
