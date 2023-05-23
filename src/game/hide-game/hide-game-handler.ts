import { inject, injectable } from "inversify";
import { IHandler } from "../../shared/mediator";
import { ConnectionStore } from "../connection/connection-store";
import { RoundStore, RoundTimeStore } from "../rounds";
import { RoundRunningHandlers } from "../rounds/round-running-handlers";

@injectable()
export class HideGameHandler implements IHandler<void> {
    constructor(
        @inject(RoundRunningHandlers) private readonly roundRunning: RoundRunningHandlers,
        @inject(ConnectionStore) private readonly connectStore: ConnectionStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) private readonly roundStore: RoundStore
    ) {}

    async handle() {
        this.roundRunning.stopRunner();
        this.roundTimeStore.stop();
        this.connectStore.onDisconnected();
        this.roundStore.isEnableGame = false;
    }
}
