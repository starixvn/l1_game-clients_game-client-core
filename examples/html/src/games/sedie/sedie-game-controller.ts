import { Connection } from "game-client-base";
import { Container } from "inversify";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";

export class SedieGameController {
    constructor(public readonly container: Container) {}

    start() {
        this.connectGameService();
        const sedieView = this.container.resolve(SedieGameHtmlView);
        sedieView.onLoad();
    }

    connectGameService() {
        const handler = this.container.resolve(Connection.ConnectionHandlers.ConnectHandler);
        handler.handle();
        const connection = this.container.resolve(Connection.ConnectionStore).connection;
        connection.emit("joinRoom", "sedie");
    }
}
