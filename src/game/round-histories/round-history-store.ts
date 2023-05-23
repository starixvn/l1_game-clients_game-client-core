import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { RoundTimeStore } from "../rounds";

export interface RoundHistory {
    roundId: number;
    result: any;
    settlementResult: any;
}

export type TJoinRoomInfo = {
    roundHistory: RoundHistory;
    joinGameState: string;
};

@injectable()
export class RoundHistoryStore {
    constructor(@inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore) {
        makeAutoObservable(this);
    }

    histories: RoundHistory[] = [];

    get joinRoomInfo(): TJoinRoomInfo {
        const roundHistory = this?.histories[0];
        if (roundHistory) {
            return {
                roundHistory: roundHistory,
                joinGameState: this.roundTimeStore.joinGameState,
            };
        } else {
            return {
                roundHistory: undefined,
                joinGameState: this.roundTimeStore.joinGameState,
            };
        }
    }
}
