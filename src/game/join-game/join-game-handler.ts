import { inject, injectable } from "inversify";
import { OtherPlayersStore } from "../../players";
import { IHandler } from "../../shared/mediator";
import { ChipStore } from "../chips";
import { ConnectionHandlers } from "./../connection/connection-handlers";
import { RoundStore } from "./../rounds/round-store";

@injectable()
export class JoinGameHandler implements IHandler<void> {
    constructor(
        @inject(ConnectionHandlers.ConnectHandler) private readonly connection: ConnectionHandlers.ConnectHandler,
        @inject(RoundStore) private readonly roundStore: RoundStore,
        @inject(ChipStore) private readonly chipStore: ChipStore,
        @inject(OtherPlayersStore) private readonly otherPlayersStore: OtherPlayersStore
    ) {}

    async handle() {
        this.roundStore.resetRoundStore();
        this.chipStore.resetChips();
        this.otherPlayersStore.resetOtherPlayersStore();
        this.connection.handle();
    }
}
