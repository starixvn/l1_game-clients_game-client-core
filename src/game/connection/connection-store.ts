import { inject, injectable } from "inversify";
import { ISessionInfo } from "../../auth";
import { GameClientEmitMessage, Mediator } from "../../shared";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { GameSetting } from "../game-configs";
import { SocketConnectionStore } from "../../socket-connection";
import { Socket } from "socket.io-client";
import { makeAutoObservable } from "mobx";

export const GameServiceEvent = {
    signedIn: "signedIn",
};
@injectable()
export class ConnectionStore {
    socketConnectionStore: SocketConnectionStore = null;
    constructor(
        @inject(SocketConnectionStore) protected readonly socketConnectionStoreInject: SocketConnectionStore,
        @inject(Mediator) protected readonly mediator: Mediator,
        @inject(GameSetting) protected readonly gameSetting: GameSetting
    ) {
        makeAutoObservable(this);
        this.socketConnectionStore = socketConnectionStoreInject;
    }
    signedIn = false;

    initConnection(connection: Socket) {
        this.socketConnectionStore.connection = connection;
        this.socketConnectionStore.initBaseListener();
        this.socketConnectionStore.connection.on("connect", this.onConnected.bind(this));
    }

    onConnected() {
        this.socketConnectionStore.connection.on(GameServiceEvent.signedIn, this.onSignedIn.bind(this));
        this.socketConnectionStore.connection.onAny(this.onHandleData.bind(this));
        this.signIn();
    }

    onHandleData(event: string, value: any) {
        console.log(event);
        if (event?.toLocaleLowerCase() === this.gameSetting?.name.toLocaleLowerCase() || event?.toLocaleLowerCase() === "message") {
            Object.entries(value).forEach((entry) => {
                const [key, value] = entry;
                this.mediator.emit(key, value);
            });
        } else {
            this.mediator.emit(event, value);
        }
    }

    signIn() {
        const payload = new GameClientEmitMessage.Signin();
        const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
        payload.ss = sessionInfo?.session;
        payload.username = sessionInfo?.username;
        payload.system = sessionInfo?.system;

        this.send(GameClientEmitMessage.Signin.eventName, payload);
    }

    onSignedIn() {
        this.signedIn = true;
    }

    send(eventName: string, data: any) {
        this.socketConnectionStore.connection?.emit(eventName, data);
    }
}
