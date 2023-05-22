import { injectable } from "inversify";
import { action, computed, makeObservable, observable } from "mobx";
import { GameServiceMessage } from "../../shared";
@injectable()
export class SettlementStore {
    roundId = 0;
    result: any = null;
    settlementResult: any = null;
    finishedShowResult = false;
    finishedSettle = false;

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        finish?.roundId && (this.roundId = finish.roundId);
        finish?.result && (this.result = finish.result);
        finish?.settlementResult && (this.settlementResult = finish.settlementResult);

        this.finishedShowResult = false;
        this.finishedSettle = false;

        console.log("------Result---------");
        console.log(JSON.stringify(this.result));
        console.log("------Settlement---------");
        console.log(JSON.stringify(this.settlementResult));
    }

    get roundIdAndResult() {
        return {
            roundId: this.roundId,
            result: this.result,
        };
    }
    constructor() {
        makeObservable(this, {
            roundId: observable,
            result: observable,
            settlementResult: observable,
            finishedShowResult: observable,
            setSettlementStore: action,
            roundIdAndResult: computed,
        });
    }
}
