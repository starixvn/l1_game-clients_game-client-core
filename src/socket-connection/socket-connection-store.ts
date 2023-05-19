import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { Mediator } from "../shared";

export const events = {
    connect: "connect",
    reconnect: "reconnect",
    connectFailed: "connect_failed",
    connectError: "connect_error",
    disconnect: "disconnect",
};

@injectable()
export class SocketConnectionStore {
    constructor(@inject(Mediator) protected readonly mediator: Mediator) {}

    connection: Socket = null;
    isConnected = false;
    isConnectFailed = false;

    initBaseListener() {
        if (this.connection) {
            this.connection.on(events.connect, this.onConnected.bind(this));
            this.connection.on(events.connectError, this.onConnectFailed.bind(this));
            this.connection.on(events.connectFailed, this.onConnectFailed.bind(this));
            this.connection.on(events.disconnect, this.onDisconnected.bind(this));
        }
    }

    onConnected() {
        this.isConnected = true;
        this.isConnectFailed = false;
    }

    onConnectFailed() {
        this.isConnectFailed = true;
        this.onDisconnected();
    }

    onDisconnected() {
        this.isConnected = false;
        this.connection.disconnect();
    }
}
