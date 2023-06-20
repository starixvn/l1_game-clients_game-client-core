import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface BetHistoryModel {
    page: number;
    pageSize: number;
    total: number;
    betLogs: Array<any>;
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
