import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../rounds";

export interface RoundHistory {
    roundId: number;
    result: GameServiceMessage.TResult;
    settlementResult: GameServiceMessage.TSettlementResult;
}

interface IJoinRoom {
    roundHistory: RoundHistory;
}

export interface IJoinRoomShowResult extends IJoinRoom {
    isShowResult: boolean;
}

export interface TJoinRoomHighLight extends IJoinRoom {
    isHighLightWithoutAnim: boolean;
}

@injectable()
export class RoundHistoryStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
    ) {
        makeAutoObservable(this);
    }

    histories: RoundHistory[] = [];

    getLastRound() {
        return this.histories?.[0];
    }

    get joinRoomShowResult(): IJoinRoomShowResult {
        let isShowResult = false;
        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_RESULT
        ) {
            isShowResult = true;
        }

        return {
            isShowResult,
            roundHistory: this.getLastRound(),
        };
    }

    get joinRoomHighLight(): TJoinRoomHighLight {
        let isHighLightWithoutAnim = false;
        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.STARTING_ROUND ||
            this.roundTimeStore.joinGameState === ROUND_STATE.PLACING_BET
        ) {
            isHighLightWithoutAnim = true;
        }

        return {
            isHighLightWithoutAnim,
            roundHistory: this.getLastRound(),
        };
    }
}
