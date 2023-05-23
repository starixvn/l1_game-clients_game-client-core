import { injectable } from "inversify";
import { action, makeObservable, observable } from "mobx";
import { GameServiceMessage } from "../../shared";
@injectable()
export class SettlementStore {
    roundId = 0;
    result: any = null;
    settlementResult: any = null;
    finishedShowResult = false;
    finishedSettle = false;

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        this.finishedShowResult = false;
        this.finishedSettle = false;
        finish?.roundId && (this.roundId = finish.roundId);
        finish?.result && (this.result = finish.result);
        finish?.settlementResult && (this.settlementResult = finish.settlementResult);
    }

    constructor() {
        makeObservable(this, {
            roundId: observable,
            result: observable,
            settlementResult: observable,
            finishedShowResult: observable,
            setSettlementStore: action,
        });
    }
}
