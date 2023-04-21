import { io } from "socket.io-client/dist/socket.io.js";
import { ConnectionStore, events } from "../../../../src/game/connection";
import { GameClientEmitMessage, Mediator } from "../../../../src/shared";
import { StorageManager, localStorageKeys } from "../../../../src/shared/utils";
import { gameSettings } from "../../container.test";

jest.mock("socket.io-client/dist/socket.io.js", () => ({
    io: jest.fn().mockReturnValue({ on: jest.fn() }),
}));
jest.mock("mobx");

describe("ConnectionStore tests", () => {
    describe("initBaseListener", () => {
        describe("when connection not null", () => {
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("", {});
            store.connection.on = jest.fn();
            it("should init listeners onConnected", () => {
                // act
                store.initBaseListener();

                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[0][0]).toBe(events.connect);
                expect(store.connection.on.mock.calls[0][1].toString()).toBe(store.onConnected.bind(store).toString());
            });

            it("should init listeners onSignedIn", () => {
                // act
                store.initBaseListener();

                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[1][0]).toBe(events.signedIn);
                expect(store.connection.on.mock.calls[1][1].toString()).toBe(store.onSignedIn.bind(store).toString());
            });

            it("should init listeners onConnectFailed and event is connect_error", () => {
                // act
                store.initBaseListener();

                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[2][0]).toBe(events.connectError);
                expect(store.connection.on.mock.calls[2][1].toString()).toBe(store.onConnectFailed.bind(store).toString());
            });

            it("should init listeners onConnectFailed and event is connect_failed", () => {
                // act
                store.initBaseListener();

                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[3][0]).toBe(events.connectFailed);
                expect(store.connection.on.mock.calls[3][1].toString()).toBe(store.onConnectFailed.bind(store).toString());
            });
            it("should init listeners onDisconnected and event is disconnect", () => {
                // act
                store.initBaseListener();

                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[4][0]).toBe(events.disconnect);
                expect(store.connection.on.mock.calls[4][1].toString()).toBe(store.onDisconnected.bind(store).toString());
            });
        });
    });

    describe("onConnected", () => {
        const sessionInfo = { session: "session", username: "username", system: 1 };
        StorageManager.set(localStorageKeys.session, sessionInfo);

        it("should set isConnected true", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("", {});
            store.connection.onAny = jest.fn();
            store.connection.emit = jest.fn();

            // act
            store.onConnected();

            // assert
            expect(store.isConnected).toBe(true);
        });

        it("should set isConnectFailed false", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("", {});
            store.connection.onAny = jest.fn();
            store.connection.emit = jest.fn();

            // act
            store.onConnected();

            // assert
            expect(store.isConnectFailed).toBe(false);
        });

        it("should call connection onAny", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("", {});
            store.connection.onAny = jest.fn();
            store.connection.emit = jest.fn();

            // act
            store.onConnected();

            // assert
            expect(store.connection.onAny.mock.calls[0][0].toString()).toBe(store.onHandleData.bind(store).toString());
        });

        it("should call signin", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("", {});
            store.connection.onAny = jest.fn();
            store.connection.emit = jest.fn();

            const payload = new GameClientEmitMessage.Signin();
            payload.ss = sessionInfo?.session;
            payload.username = sessionInfo?.username;
            payload.system = sessionInfo?.system;

            // act
            store.onConnected();

            // assert
            expect(store.connection.emit).toHaveBeenCalledWith(GameClientEmitMessage.Signin.eventName, payload);
        });
    });

    describe("onHandleData", () => {
        it("should call mediator emit with keys of payload when event equal game name", () => {
            // arrange
            const mediator = new Mediator();
            mediator.emit = jest.fn();
            const store = new ConnectionStore(mediator, gameSettings);
            const payload = { roundId: 1, remainingTime: 20 };

            // act
            store.onHandleData(gameSettings.name, payload);

            // assert
            expect(mediator.emit).toHaveBeenCalledTimes(2);
            expect((mediator.emit as jest.Mock).mock.calls[0][0]).toBe("roundId");
            expect((mediator.emit as jest.Mock).mock.calls[0][1]).toBe(1);
            expect((mediator.emit as jest.Mock).mock.calls[1][0]).toBe("remainingTime");
            expect((mediator.emit as jest.Mock).mock.calls[1][1]).toBe(20);
        });
        it("should call mediator emit with keys of payload when event is message", () => {
            // arrange
            const mediator = new Mediator();
            mediator.emit = jest.fn();
            const store = new ConnectionStore(mediator, gameSettings);
            const payload = { userStakeLevel: { minBet: 1, maxBet: 2000 } };

            // act
            store.onHandleData("message", payload);

            // assert
            expect(mediator.emit).toHaveBeenCalled();
            expect((mediator.emit as jest.Mock).mock.calls[0][0]).toBe("userStakeLevel");
            expect((mediator.emit as jest.Mock).mock.calls[0][1]).toEqual({ minBet: 1, maxBet: 2000 });
        });

        it("should call mediator emit with payload when event is not game name or message", () => {
            // arrange
            const mediator = new Mediator();
            mediator.emit = jest.fn();
            const store = new ConnectionStore(mediator, gameSettings);
            const payload = { value: 123 };

            // act
            store.onHandleData("test-event", payload);

            // assert
            expect(mediator.emit).toHaveBeenCalled();
            expect((mediator.emit as jest.Mock).mock.calls[0][0]).toBe("test-event");
            expect((mediator.emit as jest.Mock).mock.calls[0][1]).toEqual(payload);
        });
    });

    describe("onSignedIn", () => {
        it("should set signedIn is true", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);

            // act
            store.onSignedIn();

            // assert
            expect(store.signedIn).toBe(true);
        });
    });

    describe("onConnectFailed", () => {
        it("should set isConnectFailed is true", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onConnectFailed();

            // assert
            expect(store.isConnectFailed).toBe(true);
        });

        it("should set isConnected is false", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onConnectFailed();

            // assert
            expect(store.isConnected).toBe(false);
        });

        it("should set signedIn is false", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onConnectFailed();

            // assert
            expect(store.signedIn).toBe(false);
        });

        it("should call connection disconnect", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onConnectFailed();

            // assert
            expect(store.connection.disconnect).toHaveBeenCalled();
        });
    });

    describe("onDisconnected", () => {
        it("should set isConnected is false", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onDisconnected();

            // assert
            expect(store.isConnected).toBe(false);
        });

        it("should set signedIn is false", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onDisconnected();

            // assert
            expect(store.signedIn).toBe(false);
        });

        it("should call connection disconnect", () => {
            // arrange
            const store = new ConnectionStore(new Mediator(), gameSettings);
            store.connection = io("");
            store.connection.disconnect = jest.fn();

            // act
            store.onDisconnected();

            // assert
            expect(store.connection.disconnect).toHaveBeenCalled();
        });
    });
});
