import { io } from "socket.io-client/dist/socket.io.js";
import { Mediator } from "../../../src/shared";
import { StorageManager, localStorageKeys } from "../../../src/shared/utils";
import { SocketConnectionStore, events } from "../../../src/socket-connection";

jest.mock("socket.io-client/dist/socket.io.js", () => ({
    io: jest.fn().mockReturnValue({ on: jest.fn() }),
}));
jest.mock("mobx");

let store: SocketConnectionStore;

describe("ConnectionStore tests", () => {
    beforeAll(() => {
        // arrange
        store = new SocketConnectionStore(new Mediator());
        store.connection = io("", {});
        store.connection.on = jest.fn();
    });

    describe("initBaseListener", () => {
        describe("when connection not null", () => {
            beforeAll(() => {
                // act
                store.initBaseListener();
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
});
