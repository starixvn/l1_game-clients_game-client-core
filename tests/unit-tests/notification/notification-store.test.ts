import { io } from "socket.io-client/dist/socket.io.js";
import { GameServiceMessage, Mediator } from "../../../src/shared";
import { NotificationEvent, NotificationStore } from "../../../src/notification";

jest.mock("mobx");

jest.mock("socket.io-client/dist/socket.io.js", () => ({
    io: jest.fn().mockReturnValue({ on: jest.fn() }),
}));

describe("NotificationStore tests", () => {
    describe("onConnected", () => {
        it("should call connection onAny", () => {
            // arrange
            const store = new NotificationStore(new Mediator());
            store.connection = io("");
            store.connection.onHandleKickedOut = jest.fn();
            store.connection.emit = jest.fn();

            // act
            store.onConnected();

            // assert
            expect(store.connection.on.mock.calls[0][0]).toBe(NotificationEvent.kickedOut);
        });
    });

    describe("onHandleKickedOut", () => {
        it("should call mediator emit with keys of payload when event equal game name", () => {
            // arrange
            const mediator = new Mediator();
            mediator.emit = jest.fn();
            const store = new NotificationStore(mediator);

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
