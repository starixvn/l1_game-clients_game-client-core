import { inject, injectable } from "inversify";
import { GameServiceMessage } from "../../shared";
import { GameSetting } from "../../game/game-configs";
import { RoundTimeStore } from "../rounds/round-time-store";
import { SettlementStore } from "../settlements/settlement-store";
import { RoundHistory, RoundHistoryStore as RoundHistoryStoreBase } from "../../game/round-histories";

@injectable()
export class RoundHistoryStore extends RoundHistoryStoreBase {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore
    ) {
        super(roundTimeStore, gameSetting, settlementStore);
    }

    generateJoinGameData() {
        const lastRound = this.getLastRound();
        const roundTime = this.roundTimeStore.roundTime;
        this.firstJoinGameHistory = {
            roundTime,
            roundHistory: lastRound,
            staticHighlight: this.roundTimeStore.isPlacingBet || this.roundTimeStore.isStartRound,
            animationHighlight: this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult,
        };

        if (this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult) {
            const showResultByFinish =
                this.settlementStore.currentFinish && this.settlementStore.currentFinish.drawId >= lastRound.drawId;
            if (!showResultByFinish) {
                this.joinGameHistory = {
                    roundHistory: lastRound,
                };
            }
        }
    }

    override insertNewRound(finish: GameServiceMessage.Finish) {
        const currentRound = finish as RoundHistory;

        if (this.histories[0]?.drawId === currentRound.drawId) {
            return;
        }
        const cloneHistories = JSON.parse(JSON.stringify(this.histories));
        cloneHistories.unshift(currentRound);
        this.limitNumberRoundHistory(cloneHistories);

        this.histories = cloneHistories;
    }

    override  updateHistoriesInGame(roundHistories: RoundHistory[]) {
        if (roundHistories.length > 0) {
            const lastRound = roundHistories[0];
            const missingNewRound = this.settlementStore.currentFinish && this.settlementStore.currentFinish.drawId > lastRound.drawId;
            if (missingNewRound) {
                roundHistories.unshift(this.settlementStore.currentFinish as RoundHistory);
            }
            this.limitNumberRoundHistory(roundHistories);
        }
        this.histories = roundHistories;
        this.setReceivedInGame(true);
    }
}
