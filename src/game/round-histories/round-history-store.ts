import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";
import { GameSetting } from "../game-configs";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../rounds";

export interface RoundHistory {
    roundId: number;
    result: GameServiceMessage.TResult;
    settlementResult: GameServiceMessage.TSettlementResult;
    winningPlayers?: GameServiceMessage.TWinningPlayers;
}

export interface IRoundHistoryInfo {
    roundHistory: RoundHistory;
}

export interface THighLightInfo extends IRoundHistoryInfo {
    isHighLightAnim: boolean;
    isResetHighlight: boolean;
}

@injectable()
export class RoundHistoryStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting
    ) {
        makeAutoObservable(this);
    }

    private _histories: RoundHistory[] = [];
    private _lastRoundWhenJoinGame: RoundHistory | null = null;

    get histories() {
        return this._histories;
    }

    set histories(histories: RoundHistory[]) {
        this._histories = histories;
        if (!this.lastRoundWhenJoinGame) {
            this.lastRoundWhenJoinGame = this.histories?.[0];
        }
    }

    get lastRoundWhenJoinGame() {
        return this._lastRoundWhenJoinGame;
    }

    set lastRoundWhenJoinGame(lastRoundWhenJoinGame: RoundHistory | null) {
        this._lastRoundWhenJoinGame = lastRoundWhenJoinGame;
    }

    getLastRound() {
        return this.histories?.[0];
    }

    updateHistories(finish: GameServiceMessage.Finish) {
        const currentRound = finish as RoundHistory;
        const cloneHistories = JSON.parse(JSON.stringify(this.histories));
        cloneHistories.unshift(currentRound);
        if (this.histories.length > this.gameSetting.numberOfRoundHistory) {
            cloneHistories.pop();
        }

        this.histories = cloneHistories;
    }

    get joinRoomShowResult(): IRoundHistoryInfo | null {
        if (this.lastRoundWhenJoinGame) {
            if (
                this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
                this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_RESULT
            ) {
                return {
                    roundHistory: this.lastRoundWhenJoinGame,
                };
            }
        }

        return null;
    }

    get highLightInfo(): THighLightInfo {
        let isHighLightAnim = false;
        let isResetHighlight = false;

        switch (this.roundTimeStore.roundState) {
            case ROUND_STATE.SHOW_RESULT:
                isHighLightAnim = true;
                break;
            case ROUND_STATE.STARTING_ROUND:
            case ROUND_STATE.PLACING_BET:
                isHighLightAnim = false;
                break;
            case ROUND_STATE.LOCKING_BET:
            case ROUND_STATE.SHOW_ANIMATION_RESULT:
                isResetHighlight = true;
                break;
        }

        return {
            isHighLightAnim,
            roundHistory: this.getLastRound(),
            isResetHighlight,
        };
    }

    get isResetResultJoinRoom(): boolean {
        let isReset = false;
        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.PLACING_BET ||
            this.roundTimeStore.joinGameState === ROUND_STATE.LOCKING_BET ||
            this.roundTimeStore.joinGameState === ROUND_STATE.STARTING_ROUND
        ) {
            isReset = true;
        }

        return isReset;
    }

    resetRoundHistoryStore() {
        this.histories = [];
        this._lastRoundWhenJoinGame = null;
    }
}
