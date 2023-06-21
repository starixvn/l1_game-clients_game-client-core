import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { ISessionInfo } from "../../auth";
import { GameClientEmitMessage, Mediator } from "../../shared";
import { SocketEvents } from "../../shared/constants/socket-event";
import { StorageManager, localStorageKeys, sentryLogger } from "../../shared/utils";
import { GameSetting } from "../game-configs";

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
    isConnected: boolean = null;
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
            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                this.mediator.emit(key, value);
            });
        } else {
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

    onConnectFailed(error?: Error) {
        this.isConnectFailed = true;
        this.onDisconnected();
        error && sentryLogger.logError(error);
    }

    onDisconnected(reason = "") {
        this.isConnected = false;
        this.signedIn = false;
        this.connection.disconnect();
        reason && sentryLogger.logError(reason);
    }

    send(eventName: string, data: any) {
        this.connection?.emit(eventName, data);
    }
}
