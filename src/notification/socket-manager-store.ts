import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client";

@injectable()
export class SocketManagerStore {
    sockets: Array<Socket> = [];

    constructor() {
        makeAutoObservable(this);
    }

    addSocket(socket: Socket) {
        this.sockets.push(socket);
    }

    clearSockets() {
        this.sockets.forEach((socket: Socket) => {
            socket.disconnect();
        });
        this.sockets = [];
    }
}
