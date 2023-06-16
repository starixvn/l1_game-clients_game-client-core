import { inject, injectable } from "inversify";
import { when } from "mobx";
import { IHandler } from "../../shared";
import { SettlementStatusStore } from "../settlements";
import { RoundStore } from "./round-store";
import { ROUND_STATE, RoundTimeStore } from "./round-time-store";

export namespace RoundUIHandlers {
    @injectable()
    export class StartingRoundHandler implements IHandler<void> {
        constructor(
            @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
            @inject(RoundStore) private readonly roundStore: RoundStore,
            @inject(SettlementStatusStore) private readonly settlementStatusStore: SettlementStatusStore
        ) {
            when(this.isStartingRound, this.handle);
        }

        isStartingRound = () => {
            return this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND;
        };

        handle = () => {
            this.roundStore.resetForNewRound();
            this.settlementStatusStore.resetSettlementStatus();
        };
    }
}
