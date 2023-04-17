import { container as SharedContainer } from "../../../splash/scripts/splash-container";

import { Component, _decorator } from "cc";
import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";
import { LogStore } from "./stores/log-store";

const gameSetting: gc.GameConfigs.GameSetting = {
    id: 1,
    name: "SeDie",
    durations: {
        wholeRound: 39,
        lockingBet: 5,
        placingBet: 30,
    },
};

const containerOptions: gc.IContainerOptions = {
    globalContainer: SharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(gameSetting);
        container.bind(LogStore).to(LogStore);
    },
};

const container = gc.getContainer(containerOptions);

Observer.configure({ sedie: { mobx, container } });

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer("sedie")
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
            extraHeaders: {
                "user-agent": "browser-user-agent",
                "test-test": "browser-user-agent",
            },
        };

        return { socketUri, socketOptions };
    }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    onConnected(isConnected: boolean) {
        if (isConnected) {
            this.signIn();
        }
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn() {
        return {};
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }
}
