import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { GameClientEmitMessage, GameServiceMessage, IMultipleHandlers } from "../../shared";
import { ConnectionStore } from "../connection/connection-store";
import { RoundStore } from "../rounds/round-store";
import { RoundPFStore } from "./round-pf-store";

@injectable()
export class RoundPFHandler implements IMultipleHandlers {
    constructor(
        @inject(RoundPFStore) protected readonly roundPFStore: RoundPFStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
    ) {
        reaction(
            () => this.roundStore.clientRoundId,
            (roundId: number) => {
                if (roundId > 0) {
                    this.requestRoundPF(roundId, true);
                }
            }
        );
    }

    requestForCurrentRound = false;

    eventHandleList = [
        {
            name: GameServiceMessage.RoundPFResult.eventName,
            handle: this.handleReceiveRoundPF,
        },
    ];

    requestRoundPF(roundId: number, requestForCurrentRound = false) {
        this.requestForCurrentRound = requestForCurrentRound;
        this.connectionStore.send(GameClientEmitMessage.RoundPF.eventName, { roundId });
    }

    handleReceiveRoundPF(roundPfResult: GameServiceMessage.RoundPFResult) {
        if (this.requestForCurrentRound) {
            this.roundPFStore.currentPF = roundPfResult;
        } else {
            this.roundPFStore.pf = roundPfResult;
        }
    }
}
