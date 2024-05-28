import { inject, injectable } from "inversify";
import { ConnectionHandlers } from "../../../game/connection/connection-handlers";
import { ConnectionStore } from "../../../game/connection/connection-store";
import { GameClientEmitMessage } from "../../../shared/models/game-messages";
import { FairnessStore } from "./fairness-store";

@injectable()
export class FairnessHandler {
    constructor(
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler
    ) {}

    handle(clientSeed: string) {
        this.fairnessStore.clientSeed = clientSeed;
        this.connectionStore.send(GameClientEmitMessage.CutCard.eventName, { cutCardIndex: this.fairnessStore.clientSeed });
        
    }

    saveClientSeed(clientSeed: string) {
        this.fairnessStore.clientSeed = clientSeed;
    }
}
