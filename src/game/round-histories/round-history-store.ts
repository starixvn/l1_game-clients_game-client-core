import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface RoundHistory {
    roundId: number;
    result: any;
    settlementResult: any;
}

@injectable()
export class RoundHistoryStore {
    constructor() {
        makeAutoObservable(this);
    }

    histories: RoundHistory[] = [];
    maxLength: number = 0;
}
