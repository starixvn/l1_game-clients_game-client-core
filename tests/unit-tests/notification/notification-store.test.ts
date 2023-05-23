import { io } from "socket.io-client";
import { GameServiceMessage, Mediator } from "../../../src/shared";
import { NotificationStore, events } from "../../../src/notification";
import { StorageManager, localStorageKeys } from "../../../src/shared/utils";

jest.mock("mobx");

jest.mock("socket.io-client", () => ({
    io: jest.fn().mockReturnValue({ on: jest.fn() }),
}));

let store: NotificationStore;
let mediator: Mediator;
describe("NotificationStore tests", () => {
    beforeAll(() => {
        // arrange
        mediator = new Mediator();
        mediator.emit = jest.fn();
        store = new NotificationStore(mediator);
        store.connection = io("", {});
        store.connection.on = jest.fn();
    });

    describe("initBaseListener", () => {
        describe("when connection not null", () => {
            beforeAll(() => {
                // act
                store.initListener();
            });

            it("should init listeners onConnected", () => {
                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[0][0]).toBe(events.connect);
                expect(store.connection.on.mock.calls[0][1].toString()).toBe(store.onConnected.bind(store).toString());
            });

            it("should init listeners onConnectFailed and event is connect_error", () => {
                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[1][0]).toBe(events.connectError);
                expect(store.connection.on.mock.calls[1][1].toString()).toBe(store.onConnectFailed.bind(store).toString());
            });

            it("should init listeners onConnectFailed and event is connect_failed", () => {
                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[2][0]).toBe(events.connectFailed);
                expect(store.connection.on.mock.calls[2][1].toString()).toBe(store.onConnectFailed.bind(store).toString());
            });

            it("should init listeners onDisconnected and event is disconnect", () => {
                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[3][0]).toBe(events.disconnect);
                expect(store.connection.on.mock.calls[3][1].toString()).toBe(store.onDisconnected.bind(store).toString());
            });
        });
    });
    describe("onConnected", () => {
        beforeAll(() => {
            const sessionInfo = { session: "session", username: "username", system: 1 };
            StorageManager.set(localStorageKeys.session, sessionInfo);

            // arrange
            store.connection.onAny = jest.fn();

            // act
            store.onConnected();
        });

        afterAll(() => {
            StorageManager.set(localStorageKeys.session, {});
        });

        it("should set isConnected true", () => {
            // assert
            expect(store.isConnected).toBe(true);
        });

        it("should set isConnectFailed false", () => {
            // assert
            expect(store.isConnectFailed).toBe(false);
        });
    });

    describe("onConnectFailed", () => {
        beforeAll(() => {
            // arrange
            store.connection.disconnect = jest.fn();

            // act
            store.onConnectFailed();
        });

        it("should set isConnectFailed is true", () => {
            // assert
            expect(store.isConnectFailed).toBe(true);
        });

        it("should set isConnected is false", () => {
            // assert
            expect(store.isConnected).toBe(false);
        });

        it("should call connection disconnect", () => {
            // assert
            expect(store.connection.disconnect).toHaveBeenCalled();
        });
    });

    describe("onDisconnected", () => {
        beforeAll(() => {
            // arrange
            store.connection.disconnect = jest.fn();

            // act
            store.onDisconnected();
        });
        it("should set isConnected is false", () => {
            // assert
            expect(store.isConnected).toBe(false);
        });

        it("should call connection disconnect", () => {
            // assert
            expect(store.connection.disconnect).toHaveBeenCalled();
        });
    });

    describe("onHandleKickedOut", () => {
        it("should call mediator emit with keys of payload when event equal game name", () => {
            // arrange

            const fakeUmInfo: GameServiceMessage.UnderMaintenanceInfo = {
                message: "Game đang được bảo trì, vui lòng quay lại sau 10 phút.",
                umInfo: {
                    isUM: true,
                    startTime: new Date("2023-05-19"),
                    endTime: new Date("2023-05-20"),
                    operatorId: "2",
                },
            };

            // act
            store.onHandleKickedOut(fakeUmInfo);

            // assert
            expect(mediator.emit).toHaveBeenCalledWith(GameServiceMessage.UnderMaintenanceInfo.eventName, fakeUmInfo);
        });
    });
});
