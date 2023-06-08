import { inject, injectable } from "inversify";
import { IHandler } from "../../shared/mediator";
import { AroundTablePlayersStore } from "../around-table-players";
import { ChipStore } from "../chips";
import { RoundHistoryStore } from "../round-histories";
import { ConnectionHandlers } from "./../connection/connection-handlers";
import { RoundStore } from "./../rounds/round-store";

@injectable()
export class JoinGameHandler implements IHandler<void> {
    constructor(
        @inject(ConnectionHandlers.ConnectHandler) private readonly connection: ConnectionHandlers.ConnectHandler,
        @inject(RoundStore) private readonly roundStore: RoundStore,
        @inject(ChipStore) private readonly chipStore: ChipStore,
        @inject(AroundTablePlayersStore) private readonly otherPlayersStore: AroundTablePlayersStore,
        @inject(RoundHistoryStore) private readonly roundHistoryStore: RoundHistoryStore
    ) {}

    async handle() {
        this.roundStore.resetRoundStore();
        this.chipStore.resetChips();
        this.otherPlayersStore.resetAroundTablePlayersStore();
        this.roundHistoryStore.resetRoundHistoryStore();
        this.connection.handle();
    }
}
