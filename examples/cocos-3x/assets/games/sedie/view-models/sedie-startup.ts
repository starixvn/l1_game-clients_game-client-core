import { Component, _decorator, director } from "cc";
import { LogStore } from "db://shared-components/testing/stores/log-store";
import gc from "game-client-base";
import Observer from "observer";
import { startGame } from "../../../../extensions/shared-components/assets/startup";
import Configs from "../../../configs/Configs";
import { containerOptions, settings } from "./sedie-settings";

startGame(settings.name, containerOptions);

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class Startup extends Component {
    onLoad() {
        this.connectToService();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.Auth.AuthStore, (store) => store.isSessionTimeout)
    loadSessionTimeoutScene(isSessionTimeout: boolean) {
        isSessionTimeout && director.loadScene("session-timeout");
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }
}
