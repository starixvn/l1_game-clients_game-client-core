import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface IBetHistoryLog {
    time: string;
    roundId: number;
    win: number;
}

export interface BetHistoryModel {
    page: number;
    pageSize: number;
    total: number;
    betLogs: Array<IBetHistoryLog>;
}

@injectable()
export class BetHistoryStore {
    constructor() {
        makeAutoObservable(this);
    }

    betHistoryModel: BetHistoryModel = null;

    setData(betHistoryModel: BetHistoryModel) {
        this.betHistoryModel = betHistoryModel;
    }
}
