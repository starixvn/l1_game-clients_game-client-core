import { inject, injectable } from "inversify";
import { makeAutoObservable, when } from "mobx";
import { GameServiceMessage } from "../../shared";
import { GameSetting } from "../game-configs";
import { ROUND_STATE, RoundTimeStore } from "../rounds/round-time-store";
import { SettlementStore } from "../settlements/settlement-store";

export interface RoundHistory {
    roundId: number;
    result: GameServiceMessage.TResult;
    settlementResult: GameServiceMessage.TSettlementResult;
    winningPlayers?: GameServiceMessage.TWinningPlayers;
    md5Result?: GameServiceMessage.ResultHash;
}

export interface IJoinGameHistory {
    roundHistory: RoundHistory;
}

@injectable()
export class RoundHistoryStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore
    ) {
        makeAutoObservable(this);

        when(
            () => this.isValidHistories,
            () => {
                const lastRound = this.getLastRound();
                this.firstJoinGameHistory = {
                    roundHistory: lastRound,
                };

                if (this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult) {
                    const showResultByFinish =
                        this.settlementStore.currentFinish && this.settlementStore.currentFinish.roundId >= lastRound.roundId;
                    if (!showResultByFinish) {
                        console.log("========================== joinGameHistory created =================");
                        this.joinGameHistory = {
                            roundHistory: lastRound,
                        };
                    }
                }
            }
        );
    }

    private _histories: RoundHistory[] = [];
    private _joinGameHistory: IJoinGameHistory = null;
    private _firstJoinGameHistory: IJoinGameHistory = null;

    get histories() {
        return this._histories;
    }

    set histories(histories: RoundHistory[]) {
        this._histories = histories;
    }

    get joinGameHistory() {
        return this._joinGameHistory;
    }

    set joinGameHistory(joinGameHistory: IJoinGameHistory) {
        this._joinGameHistory = joinGameHistory;
    }

    get firstJoinGameHistory() {
        return this._firstJoinGameHistory;
    }

    set firstJoinGameHistory(history: IJoinGameHistory) {
        this._firstJoinGameHistory = history;
    }

    get isValidHistories(): boolean {
        const { _histories, roundTimeStore } = this;
        if (!_histories.length || roundTimeStore.roundState === ROUND_STATE.STOP_GAME_LOOP) {
            return false;
        }

        return true;
    }

    getLastRound() {
        return this.histories?.[0];
    }

    insertNewRound(finish: GameServiceMessage.Finish) {
        const currentRound = finish as RoundHistory;
        if (this.histories[0]?.roundId === currentRound.roundId) {
            return;
        }
        const cloneHistories = JSON.parse(JSON.stringify(this.histories));
        cloneHistories.unshift(currentRound);
        this.limitNumberRoundHistory(cloneHistories);

        this.histories = cloneHistories;
    }

    limitNumberRoundHistory(roundHistories: any) {
        if (roundHistories.length > this.gameSetting.numberOfRoundHistory) {
            roundHistories.pop();
        }
    }

    updateHistoriesInGame(roundHistories: RoundHistory[]) {
        if (roundHistories.length > 0) {
            const lastRound = roundHistories[0];
            const missingNewRound = this.settlementStore.currentFinish && this.settlementStore.currentFinish.roundId > lastRound.roundId;
            if (missingNewRound) {
                roundHistories.unshift(this.settlementStore.currentFinish as RoundHistory);
                console.log("========================= append new round from last finish");
            }
            this.limitNumberRoundHistory(roundHistories);
        }
        this.histories = roundHistories;
    }
}
