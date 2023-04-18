import { Connection } from "game-client-base";
import { Container } from "inversify";
import { DragonTigerGameHtmlView } from "./dragon-tiger-game-html-view";

export class DragonTigerGameController {
    constructor(public readonly container: Container) {}

    start() {
        this.connectGameService();
        this.inGame();
        const mainGame = this.container.resolve(DragonTigerGameHtmlView);

        mainGame.onLoad();
    }

    connectGameService() {
        const handler = this.container.resolve(Connection.ConnectionHandlers.ConnectHandler);

        handler.handle();
        const connection = this.container.resolve(Connection.ConnectionStore).connection;
        connection.emit("joinRoom", "dragontiger");
    }

    inGame() {
        this.container.resolve(Connection.ConnectionHandlers.InGameHandler).handle();
    }
}
