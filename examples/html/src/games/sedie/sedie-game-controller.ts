import { Connection } from "game-client-base";
import { Container } from "inversify";
import { ManagerOptions, SocketOptions } from "socket.io-client";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";

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
        };
        handler.handle({
            socketUri: this.gameServiceUrl,
            socketOptions,
        });
    }
}
