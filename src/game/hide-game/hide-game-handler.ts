import { inject, injectable } from "inversify";
import { IHandler } from "../../shared/mediator";
import { ConnectionStore } from "../connection/connection-store";
import { RoundRunningHandlers } from "../rounds/round-running-handlers";

@injectable()
export class HideGameHandler implements IHandler<void> {
    constructor(
        @inject(RoundRunningHandlers) protected readonly roundRunning: RoundRunningHandlers,
        @inject(ConnectionStore) protected readonly connectStore: ConnectionStore
    ) {}

    async handle() {
        this.roundRunning.stopRunner();
        this.connectStore.onDisconnected();
    }
}
