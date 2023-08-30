import { stub } from "jest-auto-stub";
import { ConnectionHandlers, ConnectionStore } from "../../../../src/game/connection";
import { RoundRunningHandlers } from "../../../../src/game/rounds";
import { GameClientEmitMessage } from "../../../../src/shared";

jest.mock("../../../../src/shared/utils", () => ({
    UrlUtils: {
        buildServerUrl: jest.fn().mockReturnValue("socketUri"),
        getProxyRoute: jest.fn().mockReturnValue("/socket.io"),
    },
}));
jest.mock("socket.io-client/dist/socket.io.js", () => ({
    io: jest.fn().mockReturnValue({}),
}));
jest.mock("socket.io-client/dist/socket.io.msgpack.min.js", () => ({
    io: jest.fn().mockReturnValue({}),
}));

describe("Connection Handlers tests", () => {
    describe("Connect", () => {
        it("should call initConnection", () => {
            // arrange
            const connectionStore = stub<ConnectionStore>();
            const handler = new ConnectionHandlers.ConnectHandler(connectionStore);

            // act
            handler.handle();

            // assert
            expect(connectionStore.initConnection).toHaveBeenCalled();
        });
    });

    describe("InGame", () => {
        it("should call emit ingame", () => {
            // arrange
            const connectionStore = stub<ConnectionStore>();
            const roundRunning = stub<RoundRunningHandlers>();
            const handler = new ConnectionHandlers.InGameHandler(connectionStore, roundRunning);

            // act
            handler.handle();

            // assert
            expect(connectionStore.send).toHaveBeenCalledWith(GameClientEmitMessage.inGame, null);
        });
    });
});
