import { SocketManagerStore } from "../../../src";
import { AppStore } from "../../../src/app/app-store";
import { SiteConfigs } from "../../../src/configs";
import { NotificationHandlers } from "../../../src/notification/notification-handlers";

jest.mock("../../../src/shared/utils/storage-manager", () => ({
    StorageManager: {
        get: jest.fn(),
        remove: jest.fn(),
    },
    localStorageKeys: { session: "session-key" },
}));
describe("NotificationHandlers tests", () => {
    describe("handle", () => {
        it("should call userService authorize with session and username from storage manager", async () => {
            // arrange
            // @ts-ignore
            const appStore = new AppStore();
            const socketManagerStore = new SocketManagerStore();
            const siteConfigs = new SiteConfigs();
            const notificationServiceHandler = new NotificationHandlers(appStore, socketManagerStore, siteConfigs);

            // act
            notificationServiceHandler.handle();

            // assert
        });
    });
});
