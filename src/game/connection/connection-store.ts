import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { Mediator } from "../../shared";
import { GameSetting } from "../game-configs";

export const events = {
    connect: "connect",
    reconnect: "reconnect",
    connectFailed: "connect_failed",
    connectError: "connect_error",
    disconnect: "disconnect",
    signedIn: "signedIn",
};
@injectable()
export class ConnectionStore {
    constructor(@inject(Mediator) protected readonly mediator: Mediator, @inject(GameSetting) protected readonly gameSetting: GameSetting) {
        makeAutoObservable(this);
    }

    connection: Socket = null;
    isConnected: boolean = false;
    isConnectFailed: boolean = false;
    signedIn: boolean = false;

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
        this.connection.onAny((event: string, value: any) => {
            if (event?.toLocaleLowerCase() === this.gameSetting?.name.toLocaleLowerCase() || event?.toLocaleLowerCase() == "message") {
                Object.entries(value).forEach((entry) => {
                    const [key, value] = entry;
                    this.mediator.emit(key, value);
                });
            } else {
                this.mediator.emit(event, value);
            }
        });
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
