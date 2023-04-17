import { Auth, Connection } from "game-client-base";
import { Container } from "inversify";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";
import { ManagerOptions, SocketOptions } from "socket.io-client";

export class SedieGameController {
    gameServiceUrl = `http://localhost:5002/user/sedie`;
    constructor(public readonly container: Container) {}

    start() {
        this.connectGameService();
        const sedieView = this.container.resolve(SedieGameHtmlView);
        sedieView.onLoad();
    }

    connectGameService() {
        const handler = this.container.resolve(Connection.ConnectionHandlers.ConnectHandler);
        const socketOptions: Partial<ManagerOptions & SocketOptions> = {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: "/socket.io",
            extraHeaders: {
                "user-agent": "browser-user-agent",
                "test-test": "browser-user-agent",
            },
        };
        handler.handle({
            socketUri: this.gameServiceUrl,
            socketOptions,
        });
    }
}
