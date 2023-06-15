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

    data: BetHistoryModel = null;

    setData(data: BetHistoryModel) {
        this.data = data;
    }
}
