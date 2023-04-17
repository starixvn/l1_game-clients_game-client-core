import sc, { Auth, Connection } from "game-client-base";
import { Container } from "inversify";
import { ManagerOptions, SocketOptions } from "socket.io-client";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";

export class SedieGameController {
    gameServiceUrl = `http://localhost:5002/user/sedie`;
    constructor(public readonly container: Container) {}

    start() {
        this.connectGameService();
        this.joinGame();
        // this.inGame();
        const sedieView = this.container.resolve(SedieGameHtmlView);
        sedieView.onLoad();
    }

    connectGameService() {
        const handler = this.container.resolve(Connection.ConnectionHandlers.ConnectHandler);
        const options = {
            socketUri: this.gameServiceUrl,
            transports: ["websocket"],
            upgrade: false,
            path: "/socket.io",
            forceNew: true,
            extraHeaders: {
                "user-agent": "browser-user-agent",
                "test-test": "browser-user-agent",
            },
            proxyRoute: "",
            enableMsgpackParser: false,
        };
        handler.handle(options);
        const connection = this.container.resolve(Connection.ConnectionStore).connection;
        connection.emit("joinRoom", "sedie");
    }

    joinGame() {
        // const player = this.container.resolve(Player.PlayerStore);
        // const socketIOStore = this.container.get(SocketIO.SocketIOStore);

        const normalUser = { playerId: 1, playerName: "NormalUser" };
        const currencyData = { code: "USD", name: "$US" };
        const testPlayer = {
            session: `${normalUser.playerId}-session-id`,
            ss: `${normalUser.playerId}-session-id`,
            currency: currencyData.name,
            username: `${normalUser.playerId}_${normalUser.playerName}`,
            browserUserAgent: "browser-user-agent",
        };

        // player.ss = `${normalUser.playerId}-session-id`;
        // player.currency = currencyData.name;
        // player.name = `${normalUser.playerId}_${normalUser.playerName}`;
        // (player.browserUserAgent = "browser-user-agent"),
        //   player.signIn(socketIOStore.connection);

        const auth = this.container.resolve(Auth.AuthStore);
        this.container
            .resolve(Connection.ConnectionHandlers.SignInHandler)
            .handle({ session: `${normalUser.playerId}-session-id`, username: `${normalUser.playerId}_${normalUser.playerName}` });
        this.container.resolve(sc.SiteConfigs.GameConfigurationHandler).handle();
    }

    inGame() {
        this.container.resolve(Connection.ConnectionHandlers.InGameHandler).handle();
    }
}
