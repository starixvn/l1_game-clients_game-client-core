import { container } from "./splash-container";

import { Component, _decorator, director } from "cc";
import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

Observer.configure({ default: { mobx, container } });

@ccclass
@observer("default")
export default class Splash extends Component {
    onLoad() {
        console.log("splash loading...");
        this.sso();
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso() {
        return { token: "player-token", system: 1 };
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthenticated)
    logAuthentication(isAuthenticated: boolean) {
        if (isAuthenticated) {
            this.authorize();
        }
    }
    @handle(gc.Auth.AuthHandlers.Authorize)
    authorize() {
        return { session: "", username: "" };
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    openGame(isAuthorized: boolean) {
        isAuthorized && director.loadScene("sedie");
    }
}
