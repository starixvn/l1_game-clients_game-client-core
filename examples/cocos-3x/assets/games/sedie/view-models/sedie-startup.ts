import { container as SharedContainer } from "../../../splash/scripts/splash-container";

import { Component, _decorator } from "cc";
import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";
import { JoinRoomHandler } from "./handlers/join-room-handler";
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
        container.bind(JoinRoomHandler).to(JoinRoomHandler);
    },
};

const container = gc.getContainer(containerOptions);

Observer.configure({ sedie: { mobx, container } });

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer("sedie")
export default class Startup extends Component {
    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {
        const socketUri = "http://localhost:3000";

        return { socketUri };
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn() {
        return {};
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    onConnected(isConnected: boolean) {
        if (isConnected) {
            this.joinRoom();
            this.signIn();
        }
    }

    @handle(JoinRoomHandler)
    joinRoom() {
        return "sedie";
    }

    onLoad() {
        this.connectToService();
        this.signIn();
    }
}
