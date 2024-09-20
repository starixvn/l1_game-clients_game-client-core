import { inject, injectable } from "inversify";
import { GameSetting } from "../../game/game-configs";
import { RoundTimeStore } from "../rounds/round-time-store";
import { SettlementStore } from "../settlements/settlement-store";
import { RoundHistoryStore as RoundHistoryStoreBase } from "../../game/round-histories";

@injectable()
export class RoundHistoryStore extends RoundHistoryStoreBase {
    protected override displayedRoundId: string = "drawId";

    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore
    ) {
        super(roundTimeStore, gameSetting, settlementStore);
    }
}