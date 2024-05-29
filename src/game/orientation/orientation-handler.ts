import { inject, injectable } from "inversify";
import { RoundHistoryStore } from "../round-histories/round-history-store";
import { SettlementStore } from "../settlements/settlement-store";
import { Orientation, OrientationStore } from "./orientation-store";

@injectable()
export class OrientationHandler {
    constructor(
        @inject(OrientationStore) private readonly orientationStore: OrientationStore,
        @inject(SettlementStore) private readonly settlementStore: SettlementStore,
        @inject(RoundHistoryStore) private readonly roundHistoryStore: RoundHistoryStore
    ) {}

    changeOrientation() {
        this.handleLastSettlement();
        this.orientationStore.orientation =
            this.orientationStore.orientation === Orientation.Landscape ? Orientation.Portrait : Orientation.Landscape;
    }

    handleLastSettlement() {
        if (this.settlementStore.currentFinish && !this.settlementStore.isFinishedShowResult) {
            this.roundHistoryStore.insertNewRound(this.settlementStore.currentFinish);
        }
    }
}
