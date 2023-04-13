import { Shared, Game, getContainer, registerGameModules, Auth } from "game-client-base";
import { Container } from "inversify";
import { reaction } from "mobx";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";

export class SedieGameController {
    container: Container;
    gameServiceUrl = "http://localhost:3000";
    gameSetting: Game.GameSetting = {
        id: 1,
        name: "SeDie",
        durations: {
            wholeRound: 39,
            lockingBet: 5,
            placingBet: 30,
        },
    };

    init() {
        const rootContainer = getContainer();
        this.container = getContainer(this.gameSetting.name);
        this.container.bind(Game.GameSetting).toConstantValue(this.gameSetting);
        registerGameModules(this.container as Shared.IContainer);
        this.container.parent = rootContainer;
    }

    start() {
        this.connectGameService();
        this.joinGame();
        this.inGame();
        this.logInfo();
        const sedieView = this.container.resolve(SedieGameHtmlView);
        sedieView.onLoad();
    }

    logInfo() {
        const roundTimeStore = this.container.resolve(Game.RoundTimeStore);
        const roundStore = this.container.resolve(Game.RoundStore);
        reaction(
            () => roundTimeStore._beginState,
            (beginState) => {
                console.log(
                    `${this.gameSetting.name}: RoundId: ${roundStore.roundId} Round Time: ${roundTimeStore._roundTime}, Begin State: ${beginState}`
                );
            }
        );

        reaction(
            () => roundTimeStore._roundTime,
            (roundTime) => {
                console.log(
                    `${this.gameSetting.name}: RoundId: ${roundStore.roundId} Round Time: ${roundTime}, Round State: ${roundTimeStore._roundState}`
                );
            }
        );
    }

    connectGameService() {
        const handler = this.container.resolve(Game.ConnectionHandlers.ConnectHandler);
        handler.handle({
            socketUri: this.gameServiceUrl,
        });
        const connection = this.container.resolve(Game.ConnectionStore).connection;
        connection.emit("joinRoom", this.gameSetting.name.toLocaleLowerCase());
    }

    joinGame() {
        const auth = this.container.resolve(Auth.AuthStore);
        this.container.resolve(Game.ConnectionHandlers.SignInHandler).handle(auth);
    }

    inGame() {
        this.container.resolve(Game.ConnectionHandlers.InGameHandler).handle();
    }
}
