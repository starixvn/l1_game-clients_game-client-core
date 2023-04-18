import { Component, _decorator } from "cc";
import { LogStore } from "db://shared-components/testing/stores/log-store";
import gc from "game-client-base";
import Observer from "observer";
import { startGame } from "../../../../extensions/shared-components/assets/startup";
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
    connectToService() {
        const socketUri = "http://localhost:5002/user/sedie";
        const socketOptions = {
            transports: ["websocket"],
            upgrade: false,
            path: "/socket.io",
            forceNew: true,
        };

        return { socketUri, socketOptions };
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }
}
