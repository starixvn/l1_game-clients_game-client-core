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
    isShowHighLight: boolean;
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
        let isShowHighLight = false;
        if (
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.SHOW_RESULT ||
            this.roundTimeStore.joinGameState === ROUND_STATE.PLACING_BET
        ) {
            isShowHighLight = true;
        }

        if (this.roundTimeStore.joinGameState === ROUND_STATE.BEGIN_LOCKING_BET) {
            isShowHighLight = false;
        }

        return {
            isJoinRoom: this.isJoinRoom,
            isShowHighLight,
            roundHistory: this.histories[0],
        };
    }
}
