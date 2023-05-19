import { io } from "socket.io-client/dist/socket.io.js";
import { ConnectionStore, GameServiceEvent } from "../../../../src/game/connection";
import { Mediator } from "../../../../src/shared";
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

            it("should init listeners onSignedIn", () => {
                // act
                store.initBaseListener();

                // assert
                expect(store.connection.on).toHaveBeenCalled();
                expect(store.connection.on.mock.calls[4][0]).toBe(GameServiceEvent.signedIn);
                expect(store.connection.on.mock.calls[4][1].toString()).toBe(store.onSignedIn.bind(store).toString());
            });
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
});
