import { inject, injectable } from "inversify";
import { action, computed, makeObservable, observable, when } from "mobx";
import { GameServiceMessage } from "../../shared";
import { GameSetting } from "../game-configs";
import { ROUND_STATE, RoundTimeStore } from "../rounds/round-time-store";
import { SettlementStore } from "../settlements/settlement-store";

export interface RoundHistory {
    roundId: number;
    drawId?: number;
    result: GameServiceMessage.TResult;
    settlementResult: GameServiceMessage.TSettlementResult;
    winningPlayers?: GameServiceMessage.TWinningPlayers;
    md5Result?: GameServiceMessage.ResultHash;
}

export interface IJoinGameHistory {
    roundHistory: RoundHistory;
}

export interface IFirstJoinGameHistory {
    roundTime: number;
    roundHistory: RoundHistory;
    staticHighlight: boolean;
    animationHighlight: boolean;
}

@injectable()
export class RoundHistoryStore {
    private _histories: RoundHistory[] = [];
    private _joinGameHistory: IJoinGameHistory = null;
    firstJoinGameHistory: IFirstJoinGameHistory = null;
    receivedInGame = false;

    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore
    ) {
        makeObservable(this, {
            receivedInGame: observable,
            firstJoinGameHistory: observable,
            setFirstJoinGameHistory: action,

            histories: computed,
            joinGameHistory: computed,
            isValidHistories: computed,
            getLastRound: action,
            insertNewRound: action,
            limitNumberRoundHistory: action,
            updateHistoriesInGame: action,
            clearRoundHistories: action,
            generateJoinGameData: action,
            setReceivedInGame: action
        });

        when(
            () => this.isValidHistories,
            () => {
                console.log(`this.generateJoinGameData();`);
                this.generateJoinGameData();
            }
        );
    }

    setReceivedInGame(receivedInGame) {
        this.receivedInGame = receivedInGame;
    }

    generateJoinGameData() {
        const lastRound = this.getLastRound();
        const roundTime = this.roundTimeStore.roundTime;
        this.setFirstJoinGameHistory({
            roundTime,
            roundHistory: lastRound,
            staticHighlight: this.roundTimeStore.isPlacingBet || this.roundTimeStore.isStartRound,
            animationHighlight: this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult,
        });

        if (this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult) {
            const showResultByFinish =
                this.settlementStore.currentFinish && this.settlementStore.currentFinish.roundId >= lastRound.roundId;
            if (!showResultByFinish) {
                this.joinGameHistory = {
                    roundHistory: lastRound,
                };
            }
        }
    }

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


    setFirstJoinGameHistory(history: IFirstJoinGameHistory) {
        this.firstJoinGameHistory = history;
    }

    get isValidHistories(): boolean {
        const { roundTimeStore } = this;
        if (!this.receivedInGame || roundTimeStore.roundState === ROUND_STATE.STOP_GAME_LOOP) {
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
            }
            this.limitNumberRoundHistory(roundHistories);
        }
        this.histories = roundHistories;

        this.setReceivedInGame(true);
    }

    clearRoundHistories() {
        this.histories = [];
    }
}
