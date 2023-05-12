import { io } from "socket.io-client/dist/socket.io.js";
import { SocketManagerStore } from "../../../src/notification/socket-manager-store";

jest.mock("socket.io-client/dist/socket.io.js", () => ({
    io: jest.fn().mockReturnValue({
        on: jest.fn(),
        disconnect: jest.fn(),
    }),
}));

describe("SocketManagerStore tests", () => {
    describe("addSocket", () => {
        it("should store new socket", () => {
            // arrange
            const store: SocketManagerStore = new SocketManagerStore();
            const socket = io("", {});

            // act
            store.addSocket(socket);

            // assert
            expect(store.sockets.length).toEqual(1);
        });
    });

    describe("clearSockets", () => {
        it("should clear the store", () => {
            // arrange
            const store: SocketManagerStore = new SocketManagerStore();
            store.addSocket(io("", {}));

            // act
            store.clearSockets();

            // assert
            expect(store.sockets.length).toEqual(0);
        });
    });
});
