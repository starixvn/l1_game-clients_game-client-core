import "reflect-metadata";

import Observer from "observer";
import GameClient from "game-client-base";
import mobx from "mobx";
import { Component, _decorator } from "cc";
import { LogStore } from "./stores/log-store";

const gameSetting: GameClient.Game.GameSetting = {
    id: 1,
    name: "SeDie",
    durations: {
        wholeRound: 39,
        lockingBet: 5,
        placingBet: 30
    }
};
const rootContainer = GameClient.getContainer();
const gameContainer = GameClient.getContainer(gameSetting.name);

gameContainer.bind(GameClient.Game.GameSetting).toConstantValue(gameSetting);
gameContainer.bind(LogStore).to(LogStore);

GameClient.registerGameModules(gameContainer);

gameContainer.parent = rootContainer;

Observer.configure({
    sedie: {
        mobx,
        container: gameContainer
    }
});

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer("sedie")
export default class Startup extends Component {
    @handle(GameClient.SocketIO.SocketIOConnector)
    connectToService() {
        const socketUri = "http://localhost:3000";

        return { socketUri };
    }

    @handle(GameClient.Player.UpdatePlayerProfileHandler)
    setPlayerProfile(): GameClient.Player.IPlayerProfile {
        return { name: "sedie-player", ss: "player-ss-sedie" };
    }

    @handle(GameClient.Player.SignInHandler)
    signIn() {}

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }

    onLoad() {
        this.connectToService();
        this.setPlayerProfile();
        this.signIn();
    }
}
