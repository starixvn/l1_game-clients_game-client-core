import { Auth, Connection } from "game-client-base";
import { Container } from "inversify";
import { DragonTigerGameHtmlView } from "./dragon-tiger-game-html-view";

export class DragonTigerGameController {
    gameServiceUrl = "http://localhost:3000";

    constructor(public readonly container: Container) {}

    start() {
        this.connectGameService();
        this.joinGame();
        this.inGame();
        const mainGame = this.container.resolve(DragonTigerGameHtmlView);

        mainGame.onLoad();
    }

    connectGameService() {
        const handler = this.container.resolve(Connection.ConnectionHandlers.ConnectHandler);
        handler.handle({
            socketUri: this.gameServiceUrl,
        });
        const connection = this.container.resolve(Connection.ConnectionStore).connection;
        connection.emit("joinRoom", "dragontiger");
    }

    joinGame() {
        const auth = this.container.resolve(Auth.AuthStore);
        this.container.resolve(Connection.ConnectionHandlers.SignInHandler).handle(auth);
    }

    inGame() {
        this.container.resolve(Connection.ConnectionHandlers.InGameHandler).handle();
    }
}
