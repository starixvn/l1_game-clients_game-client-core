import { injectable } from "inversify";
import { action, makeObservable, observable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class SettlementStore {
    roundId = 0;
    result: GameServiceMessage.TResult = null;
    settlementResult: GameServiceMessage.TResult = null;
    isFinishedShowResult = false;
    isFinishedSettle = false;
    winningPlayers: GameServiceMessage.TWinningPlayers = null;

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        this.isFinishedShowResult = false;
        this.isFinishedSettle = false;
        finish?.roundId && (this.roundId = finish.roundId);
        finish?.result && (this.result = finish.result);
        finish?.settlementResult && (this.settlementResult = finish.settlementResult);
        finish?.winningPlayers && (this.winningPlayers = finish.winningPlayers);
    }

    constructor() {
        makeObservable(this, {
            roundId: observable,
            result: observable,
            settlementResult: observable,
            isFinishedShowResult: observable,
            isFinishedSettle: observable,
            winningPlayers: observable,
            setSettlementStore: action,
        });
    }
}
