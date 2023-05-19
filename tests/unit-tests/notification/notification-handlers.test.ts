import { NotificationStore } from "../../../src/notification";
import { NotificationHandlers } from "../../../src/notification/notification-handlers";
import { Mediator } from "../../../src/shared";
import { siteConfigs } from "../container.test";

jest.mock("../../../src/shared/utils/storage-manager", () => ({
    StorageManager: {
        get: jest.fn().mockReturnValue({
            ss: "sessionInfo.session",
            username: "username",
        }),
        remove: jest.fn(),
    },
    localStorageKeys: { session: "session-key" },
}));

jest.mock("../../../src/shared/utils", () => ({
    UrlUtils: {
        buildUrl: jest.fn().mockReturnValue("https://notification.com"),
    },
}));

const fakeSession = {
    isAuthenticated: true,
    username: "username",
    language: "En",
    session: "abv",
    system: 1,
    ssoTime: new Date("May 19, 2023 03:24:00"),
    memberName: "membername",
};

describe("NotificationHandlers tests", () => {
    describe("handle", () => {
        describe("when on dev mode", () => {
            it("connect correct socket uri ", () => {
                // arrange
                const notificationServiceUrlDev = "https://localhost:3008";
                const cloneSiteConfigs = { ...siteConfigs };
                cloneSiteConfigs.isDev = true;
                cloneSiteConfigs.notificationServiceUrlDev = notificationServiceUrlDev;

                const handler = new NotificationHandlers(new NotificationStore(new Mediator()), siteConfigs);

                // act
                handler.handle(fakeSession);

                // assert
                expect(handler.notificationStore.connection.io["uri"]).toEqual(notificationServiceUrlDev);
                expect(handler.notificationStore.connection.io.opts["path"]).toEqual("/socket.io");
            });
        });

        describe("when on deployed mode", () => {
            it("connect correct socket uri ", () => {
                // arrange
                const cloneSiteConfigs = { ...siteConfigs };
                cloneSiteConfigs.isDev = false;

                const handler = new NotificationHandlers(new NotificationStore(new Mediator()), cloneSiteConfigs);

                // act
                handler.handle(fakeSession);

                // assert
                expect(handler.notificationStore.connection.io["uri"]).toEqual("https://notification.com");
                expect(handler.notificationStore.connection.io.opts["path"]).toEqual("/notification/socket.io");
            });
        });
    });
});
