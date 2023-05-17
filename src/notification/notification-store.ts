import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { GameServiceMessage, Mediator } from "../shared";
import { SocketEvents } from "../constants/socket-event";

export const events = {
    ...SocketEvents,
    ...{
        kickedOut: "kickedOut",
    },
};

@injectable()
export class NotificationStore {
    constructor(@inject(Mediator) protected readonly mediator: Mediator) {
        makeAutoObservable(this);
    }

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

        this.connection.on(events.kickedOut, this.onHandleKickedOut.bind(this));
    }

    onHandleKickedOut(data: GameServiceMessage.UnderMaintenanceInfo) {
        this.mediator.emit(GameServiceMessage.UnderMaintenanceInfo.eventName, data);
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
