import { inject, injectable } from "inversify";
import { reaction, when } from "mobx";
import { IHandler } from "../../shared";
import { SettlementStatusStore, SettlementStore } from "../settlements";
import { RoundStore } from "./round-store";
import { RoundTimeStore } from "./round-time-store";

export namespace RoundUIHandlers {
    @injectable()
    export class StartingRoundHandler implements IHandler<void> {
        constructor(
            @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
            @inject(RoundStore) private readonly roundStore: RoundStore,
            @inject(SettlementStatusStore) private readonly settlementStatusStore: SettlementStatusStore,
            @inject(SettlementStore) private readonly settlementStore: SettlementStore
        ) {
            reaction(
                () => this.roundTimeStore.isStartRound,
                (isStartRound) => isStartRound && this.handle()
            );

            when(
                () => !!this.roundTimeStore?.isStartingRound,
                () => {
                    console.log("resetSettlementStore------------------");
                    this.handle();
                }
            );
        }

        handle() {
            this.roundStore.resetForNewRound();
            this.settlementStatusStore.resetSettlementStatus();
            this.settlementStore.resetSettlementStore();
        }
    }
}
