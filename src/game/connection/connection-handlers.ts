import { inject, injectable } from "inversify";
import { io, ManagerOptions, SocketOptions } from "socket.io-client/dist/socket.io.js";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { ConnectionStore } from "./connection-store";

export namespace ConnectionHandlers {
    @injectable()
    export class ConnectHandler implements IHandler<{ socketUri: string; socketOptions: Partial<ManagerOptions & SocketOptions> }> {
        constructor(@inject(ConnectionStore) protected readonly store: ConnectionStore) {}

        handle({ socketUri, socketOptions }) {
            this.store.connection = io(socketUri, socketOptions);
            this.store.initBaseListener();
        }
    }

    @injectable()
    export class InGameHandler implements IHandler<void> {
        constructor(@inject(ConnectionStore) private readonly connectionStore: ConnectionStore) {}

        handle() {
            this.connectionStore.send(GameClientEmitMessage.inGame, null);
        }
    }
}
