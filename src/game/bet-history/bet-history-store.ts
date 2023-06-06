import { injectable } from "inversify";
import { makeAutoObservable, makeObservable, observable } from "mobx";

export interface BetHistoryModel {
    page: number;
    pageSize: number;
    totalItems: number;
    betLog: Array<any>;
}

@injectable()
export class BetHistoryStore {
    constructor() {
        // makeObservable(this, {
        //     showBetHistory: observable,
        //     data: observable,
        // });
        makeAutoObservable(this);
    }

    data: BetHistoryModel = null;
    showBetHistory: boolean = false;

    setData(data: BetHistoryModel) {
        console.log(" Bet History setData");
        this.data = data;
        // this.setShowBetHistory(true);
        // console.log(JSON.stringify(data, null, 2));
    }

    setShowBetHistory(showBetHistory: boolean) {
        this.showBetHistory = showBetHistory;
    }
}
