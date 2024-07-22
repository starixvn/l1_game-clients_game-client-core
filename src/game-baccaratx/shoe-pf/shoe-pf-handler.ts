import { inject, injectable } from "inversify";
import { ConnectionStore } from "../../game/connection/connection-store";
import { GameClientEmitMessage, GameServiceMessage, IMultipleHandlers } from "../../shared";
import { ShoePFStore } from "./shoe-pf-store";

@injectable()
export class ShoePFHandler implements IMultipleHandlers {
    constructor(
        @inject(ShoePFStore) protected readonly roundPFStore: ShoePFStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore
    ) {}

    requestRoundPF(roundId: number) {
        this.connectionStore.send(GameClientEmitMessage.ShoeVerification.eventName, { roundId });
    }

    handleReceiveRoundPF(roundPFResult: GameServiceMessage.ShoeVerification) {
        if (!roundPFResult) {
            return;
        }
        this.roundPFStore.pf = roundPFResult;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.ShoeVerification.eventName,
            handle: this.handleReceiveRoundPF,
        },
    ];
}
