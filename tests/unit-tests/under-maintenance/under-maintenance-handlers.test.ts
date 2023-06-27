import { stub } from "jest-auto-stub";
import { AppStore } from "../../../src/app/app-store";
import { ConnectionHandlers, ConnectionStore } from "../../../src/game/connection";
import { NotificationStore } from "../../../src/notification";
import { Mediator, NotificationServiceMessage } from "../../../src/shared";
import { StorageManager, localStorageKeys } from "../../../src/shared/utils/storage-manager";
import { UnderMaintenanceHandler } from "../../../src/under-maintenance";
import { siteConfigs } from "../container.test";

jest.mock("../../../src/shared/utils/storage-manager", () => ({
    StorageManager: {
        get: jest.fn(),
        remove: jest.fn(),
    },
    localStorageKeys: { session: "session-key" },
}));

const fakeUmInfo: NotificationServiceMessage.UnderMaintenanceInfo = {
    message: "Game đang được bảo trì, vui lòng quay lại sau 10 phút.",
    umInfo: {
        isUM: true,
        startTime: new Date("2023-05-19"),
        endTime: new Date("2023-05-20"),
        operatorId: "2",
    },
};

const appStore = new AppStore();
appStore.setUM = jest.fn();

const connectionStore = stub<ConnectionStore>();

const notificationStore = new NotificationStore(new Mediator());
notificationStore.onDisconnected = jest.fn();

const retryGameHandler: ConnectionHandlers.RetryGameHandler = stub<ConnectionHandlers.RetryGameHandler>();
retryGameHandler.clearInterval = jest.fn();

let handler: UnderMaintenanceHandler;

describe("UnderMaintenanceHandler tests", () => {
    describe("handle", () => {
        beforeAll(() => {
            // arrange
            handler = new UnderMaintenanceHandler(appStore, connectionStore, notificationStore, siteConfigs, retryGameHandler);

            // act
            handler.handle(fakeUmInfo);
        });

        describe("when under maintenance", () => {
            it("should turn  UM mode on.", () => {
                // assert
                expect(appStore.setUM).toHaveBeenCalledWith(fakeUmInfo.umInfo);
            });

            it("should disconnect notification service. ", () => {
                // assert
                expect(notificationStore.onDisconnected).toHaveBeenCalled();
            });

            it("should disconnect game service.", () => {
                // assert
                expect(connectionStore.onDisconnected).toHaveBeenCalled();
            });

            it("should clear session.", () => {
                // assert
                expect(StorageManager.remove).toHaveBeenCalledWith(localStorageKeys.session);
            });

            it("should clear interval retry game.", () => {
                // assert
                expect(retryGameHandler.clearInterval).toHaveBeenCalled();
            });
        });
    });
});
