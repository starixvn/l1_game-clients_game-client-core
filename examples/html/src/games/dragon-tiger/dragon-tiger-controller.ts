import { Shared, Game, Player, SocketIO, getContainer, registerGameModules } from "game-client-base";
import { Container } from "inversify";
import { reaction } from "mobx";
import { DragonTigerGameHtmlView } from "./dragon-tiger-game-html-view";

export class DragonTigerGameController {
    container: Container;
    gameServiceUrl = "http://localhost:3000";
    gameSetting: Game.GameSetting = {
        id: 7,
        name: "DragonTiger",
        durations: {
            wholeRound: 29,
            lockingBet: 5,
            placingBet: 20,
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
        this.logInfo();
        const mainGame = this.container.resolve(DragonTigerGameHtmlView);

        mainGame.onLoad();
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
        const handler = this.container.resolve(SocketIO.SocketIOConnector);
        handler.handle({
            socketUri: this.gameServiceUrl,
        });
    }

    joinGame() {
        const player = this.container.resolve(Player.PlayerStore);
        player.ss = "player-ss-dragon-tiger";

        const playerSignin = this.container.resolve(Player.SignInHandler);
        playerSignin.handle();
    }
}
