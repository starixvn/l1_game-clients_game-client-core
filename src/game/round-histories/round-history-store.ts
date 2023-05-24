import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { ROUND_STATE, RoundStore, RoundTimeStore } from "../rounds";

export interface RoundHistory {
    roundId: number;
    result: any;
    settlementResult: any;
}

interface IJoinRoom {
    isJoinRoom: boolean;
    roundHistory: any;
}

export interface IJoinRoomShowResult extends IJoinRoom {
    isShowResult: boolean;
}

export interface TJoinRoomHighLight extends IJoinRoom {
    isHighLightBetWon: boolean;
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
    isJoinRoom = false;

    get joinRoomShowResult(): IJoinRoomShowResult {
        let isShowResult = false;
        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_RESULT
        ) {
            isShowResult = true;
        }

        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.PLACING_BET ||
            this.roundTimeStore.joinGameState === ROUND_STATE.BEGIN_LOCKING_BET
        ) {
            isShowResult = false;
        }

        return {
            isJoinRoom: this.isJoinRoom,
            isShowResult,
            roundHistory: this.histories[0],
        };
    }

    get joinRoomHighLight(): TJoinRoomHighLight {
        let isHighLightBetWon = false;
        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.PLACING_BET
        ) {
            isHighLightBetWon = true;
        }

        if (this.roundTimeStore.joinGameState === ROUND_STATE.BEGIN_LOCKING_BET) {
            isHighLightBetWon = false;
        }

        return {
            isJoinRoom: this.isJoinRoom,
            isHighLightBetWon,
            roundHistory: this.histories[0],
        };
    }
}
