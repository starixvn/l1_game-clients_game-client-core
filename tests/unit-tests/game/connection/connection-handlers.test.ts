import { stub } from "jest-auto-stub";
import { io } from "socket.io-client/dist/socket.io.js";
import { ConnectionHandlers, ConnectionStore } from "../../../../src/game/connection";
import { RoundRunningHandlers, RoundTimeStore } from "../../../../src/game/rounds";
import { GameClientEmitMessage, Mediator } from "../../../../src/shared";
import { UrlUtils } from "../../../../src/shared/utils";
import { gameSettings, siteConfigs } from "../../container.test";

jest.mock("../../../../src/shared/utils", () => ({
    UrlUtils: {
        buildServerUrl: jest.fn().mockReturnValue("socketUri"),
        getProxyRoute: jest.fn().mockReturnValue("/socket.io"),
    },
}));
const optionsDefault = {
    path: "/socket.io",
    socketUri: "socketUri",
    transports: ["websocket"],
    upgrade: false,
    forceNew: true,
    parser: siteConfigs.enableMsgpackParserAllGames,
};
jest.mock("socket.io-client/dist/socket.io.js", () => ({
    io: jest.fn().mockReturnValue({}),
}));

describe("Connection Handlers tests", () => {
    describe("Connect", () => {
        it("should call UrlUtils.buildServerUrl with expected arguments", () => {
            // arrange
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.initBaseListener = jest.fn();
            const handler = new ConnectionHandlers.ConnectHandler(connectionStore, siteConfigs, gameSettings);

            // act
            handler.handle();

            // assert
            expect(UrlUtils.buildServerUrl).toHaveBeenCalledWith("http", siteConfigs.websocket.proxyPath, gameSettings.id, siteConfigs);
        });

        it("should call UrlUtils.getProxyRoute with expected arguments", () => {
            // arrange
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.initBaseListener = jest.fn();
            const handler = new ConnectionHandlers.ConnectHandler(connectionStore, siteConfigs, gameSettings);

            // act
            handler.handle();

            // assert
            expect(UrlUtils.getProxyRoute).toHaveBeenCalledWith(siteConfigs);
        });
        it("should call io with expected arguments", () => {
            // arrange
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.initBaseListener = jest.fn();
            const handler = new ConnectionHandlers.ConnectHandler(connectionStore, siteConfigs, gameSettings);

            // act
            handler.handle();

            // assert
            expect(io).toHaveBeenCalledWith("socketUri", optionsDefault);
        });
        it("should set connection", () => {
            // arrange
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.initBaseListener = jest.fn();
            const handler = new ConnectionHandlers.ConnectHandler(connectionStore, siteConfigs, gameSettings);

            // act
            handler.handle();

            // assert
            expect(connectionStore.connection).toEqual({});
        });
        it("should call init base listener", () => {
            // arrange
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.initBaseListener = jest.fn();
            const handler = new ConnectionHandlers.ConnectHandler(connectionStore, siteConfigs, gameSettings);

            // act
            handler.handle();

            // assert
            expect(connectionStore.initBaseListener).toHaveBeenCalled();
        });
    });

    describe("InGame", () => {
        it("should call emit ingame", () => {
            // arrange
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.send = jest.fn();
            const roundTimeStore = stub<RoundTimeStore>();
            const roundRunning = stub<RoundRunningHandlers>();
            const handler = new ConnectionHandlers.InGameHandler(connectionStore, roundTimeStore, roundRunning);

            // act
            handler.handle();

            // assert
            expect(connectionStore.send).toHaveBeenCalledWith(GameClientEmitMessage.inGame, null);
        });
    });
});
