import { inject, injectable } from "inversify";
import { GameClientEmitMessage, GameServiceMessage, IMultipleHandlers } from "../../shared";
import { ConnectionStore } from "../connection/connection-store";
import { RoundPFStore } from "./round-pf-store";

@injectable()
export class RoundPFHandler implements IMultipleHandlers {
    constructor(
        @inject(RoundPFStore) protected readonly roundPFStore: RoundPFStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore
    ) {}

    eventHandleList = [
        {
            name: GameServiceMessage.RoundPFResult.eventName,
            handle: this.handleReceiveRoundPF,
        },
    ];

    requestRoundPF(roundId: number) {
        this.connectionStore.send(GameClientEmitMessage.RoundPF.eventName, { roundId });
    }

    handleReceiveRoundPF(roundPfResult: GameServiceMessage.RoundPFResult) {
        this.roundPFStore.pf = roundPfResult;
    }
}
