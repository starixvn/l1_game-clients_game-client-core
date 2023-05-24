import { inject, injectable } from "inversify";
import { IHandler } from "../../shared/mediator";
import { RoundTimeStore } from "../rounds";
import { ConnectionHandlers } from "./../connection/connection-handlers";
import { RoundStore } from "./../rounds/round-store";

@injectable()
export class JoinGameHandler implements IHandler<void> {
    constructor(
        @inject(ConnectionHandlers.ConnectHandler) private readonly connection: ConnectionHandlers.ConnectHandler,
        @inject(RoundStore) private readonly roundStore: RoundStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore
    ) {}

    async handle() {
        this.roundStore.resetRoundStore();
        this.connection.handle();
    }
}
