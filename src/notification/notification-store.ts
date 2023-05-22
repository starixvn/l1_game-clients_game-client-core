import { inject, injectable } from "inversify";
import { GameServiceMessage, Mediator } from "../shared";
import { SocketConnectionStore } from "../socket-connection";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client";

export const NotificationEvent = {
    kickedOut: "kickedOut",
};

@injectable()
export class NotificationStore {
    socketConnectionStore: SocketConnectionStore = null;
    constructor(
        @inject(SocketConnectionStore) protected readonly socketConnectionStoreInject: SocketConnectionStore,
        @inject(Mediator) protected readonly mediator: Mediator
    ) {
        makeAutoObservable(this);
        this.socketConnectionStore = socketConnectionStoreInject;
    }

    initConnection(connection: Socket) {
        this.socketConnectionStore.connection = connection;
        this.socketConnectionStore.initBaseListener();
        this.socketConnectionStore.connection.on("connect", this.onConnected.bind(this));
    }

    onConnected() {
        this.socketConnectionStore.connection.on(NotificationEvent.kickedOut, this.onHandleKickedOut.bind(this));
    }

    onHandleKickedOut(data: GameServiceMessage.UnderMaintenanceInfo) {
        this.mediator.emit(GameServiceMessage.UnderMaintenanceInfo.eventName, data);
    }
}
