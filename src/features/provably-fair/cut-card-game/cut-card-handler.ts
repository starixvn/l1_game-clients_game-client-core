import { inject, injectable } from "inversify";
import { ConnectionStore } from "../../../game/connection/connection-store";
import { GameClientEmitMessage } from "../../../shared/models/game-messages";
import { FairnessStore } from "./fairness-store";

@injectable()
export class CutCardHandler {
    constructor(
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore
    ) {}

    handle(clientSeed: string) {
        this.fairnessStore.clientSeed = clientSeed;
        this.connectionStore.send(GameClientEmitMessage.CutCard.eventName, { cutCardIndex: this.fairnessStore.clientSeed });
    }
}
