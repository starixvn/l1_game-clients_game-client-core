import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { Mediator, NotificationServiceMessage } from "../shared";
import { SocketEvents } from "../shared/constants/socket-event";
import { sentryLogger } from "../shared/utils/logger";

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

    initListener() {
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

    onHandleKickedOut(data: boolean | NotificationServiceMessage.UnderMaintenanceInfo) {
        if (typeof data === "boolean") {
            data && this.mediator.emit(NotificationServiceMessage.sessionTimeoutEventName);
        } else {
            this.mediator.emit(NotificationServiceMessage.UnderMaintenanceInfo.eventName, data);
        }
    }

    onConnectFailed(error?: Error) {
        this.isConnectFailed = true;
        this.onDisconnected();
        error && sentryLogger.logError(error);
    }

    onDisconnected(reason = "") {
        this.isConnected = false;
        this.connection.disconnect();
        reason && sentryLogger.logError(reason);
    }
}
