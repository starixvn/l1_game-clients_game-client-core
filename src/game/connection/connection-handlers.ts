import { inject, injectable } from "inversify";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { RoundRunningHandlers } from "../rounds";
import { ConnectionStore, ISocketOption } from "./connection-store";

export namespace ConnectionHandlers {
    @injectable()
    export class ConnectHandler {
        constructor(@inject(ConnectionStore) protected readonly store: ConnectionStore) {}

        handle(customizeOptions?: ISocketOption) {
            this.store.initConnection(customizeOptions);
        }
    }

    @injectable()
    export class InGameHandler implements IHandler<void> {
        constructor(
            @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
            @inject(RoundRunningHandlers) private readonly roundRunning: RoundRunningHandlers
        ) {}

        handle() {
            this.roundRunning.stopRunner();
            this.connectionStore.send(GameClientEmitMessage.inGame, null);
        }
    }
}
