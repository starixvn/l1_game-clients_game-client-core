import { inject, injectable } from "inversify";
import { ConnectionStore } from "../../game/connection/connection-store";
import { RoundStore } from "../../game/rounds/round-store";
import { GameClientEmitMessage, GameServiceMessage, IMultipleHandlers } from "../../shared";
import { RoundPFStore } from "./round-pf-store";

@injectable()
export class RoundPFHandler implements IMultipleHandlers {
    constructor(
        @inject(RoundPFStore) protected readonly roundPFStore: RoundPFStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
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
