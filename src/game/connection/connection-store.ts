import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { ISessionInfo } from "../../auth";
import { GameClientEmitMessage, Mediator } from "../../shared";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { GameSetting } from "../game-configs";
import { SocketEvents } from "../../shared/constants/socket-event";

export const events = {
    ...SocketEvents,
    ...{
        signedIn: "signedIn",
    },
};

@injectable()
export class ConnectionStore {
    constructor(@inject(Mediator) protected readonly mediator: Mediator, @inject(GameSetting) protected readonly gameSetting: GameSetting) {
        makeAutoObservable(this);
    }

    connection: Socket = null;
    isConnected = false;
    isConnectFailed = false;
    signedIn = false;

    initBaseListener() {
        if (this.connection) {
            this.connection.on(events.connect, this.onConnected.bind(this));
            this.connection.on(events.signedIn, this.onSignedIn.bind(this));
            this.connection.on(events.connectError, this.onConnectFailed.bind(this));
            this.connection.on(events.connectFailed, this.onConnectFailed.bind(this));
            this.connection.on(events.disconnect, this.onDisconnected.bind(this));
        }
    }

    onConnected() {
        this.isConnected = true;
        this.isConnectFailed = false;
        this.connection.onAny(this.onHandleData.bind(this));
        this.signIn();
    }

    onHandleData(event: string, data: any) {
        if (event?.toLocaleLowerCase() === this.gameSetting?.name.toLocaleLowerCase() || event?.toLocaleLowerCase() === "message") {
            console.log(`event: ${event}, data: ${JSON.stringify(data)}`);
            if (event?.toLocaleLowerCase() === "message" && data.um) {
                this.mediator.emit(event, data);
                return;
            }

            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                console.log(`event: ${key}`);
                this.mediator.emit(key, value);
            });
        } else {
            console.log(`event: ${event}`);
            this.mediator.emit(event, data);
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

    onConnectFailed() {
        this.isConnectFailed = true;
        this.onDisconnected();
    }

    onDisconnected() {
        this.isConnected = false;
        this.signedIn = false;
        this.connection.disconnect();
    }

    send(eventName: string, data: any) {
        this.connection?.emit(eventName, data);
    }
}
