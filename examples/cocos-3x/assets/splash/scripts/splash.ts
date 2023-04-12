import "reflect-metadata";
import Observer from "observer";
import GameClient from "game-client-base";
import mobx from "mobx";
import { Component, _decorator, director, Node, Label } from "cc";
const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const userServiceUrl = "http://localhost:3000/user";
const rootContainer = GameClient.getContainer();
GameClient.registerSharedModules(rootContainer, userServiceUrl);
Observer.configure({
    default: {
        mobx,
        container: rootContainer
    }
});
@ccclass
@observer("default")
export default class Splash extends Component {
    @property({ type: Node })
    btnJoinGame: Node = null;

    @property({ type: Label })
    playerName: Label = null;

    onLoad() {
        this.sso();
    }

    @handle(GameClient.Auth.AuthHandlers.SSO)
    sso() {
        return { token: "player-token", system: 1 };
    }
    @render(GameClient.Auth.AuthStore, (store) => store.isAuthenticated)
    logAuthentication(isAuthenticated: boolean) {
        if (isAuthenticated) {
            this.authorize();
        }
    }
    @handle(GameClient.Auth.AuthHandlers.Authorize)
    authorize() {}

    @render(GameClient.Auth.AuthStore, (store) => store.isAuthorized)
    showButtonJoinGame(isAuthorized: boolean) {
        this.btnJoinGame && (this.btnJoinGame.active = isAuthorized);
    }

    @render(GameClient.Player.PlayerStore, (store) => store.name)
    showName(name: string) {
        this.playerName && (this.playerName.string = name);
    }

    openGameSedie() {
        director.loadScene("sedie");
    }
}
