import { injectable } from "inversify";
import { action, makeObservable, observable } from "mobx";
import { GameServiceMessage } from "../../shared";

export type TPayChipInfo = {
    settlementResult: GameServiceMessage.TSettlementResult;
    winningPlayers: GameServiceMessage.TWinningPlayers;
};

@injectable()
export class SettlementStore {
    roundId = 0;
    result: GameServiceMessage.TResult = null;
    settlementResult: GameServiceMessage.TSettlementResult = null;
    isFinishedShowResult = false;
    winningPlayers: GameServiceMessage.TWinningPlayers = null;

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        this.isFinishedShowResult = false;
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
            winningPlayers: observable,
            setSettlementStore: action,
        });
    }

    get payChipInfo(): TPayChipInfo {
        if (this.isFinishedShowResult) {
            return {
                settlementResult: this.settlementResult,
                winningPlayers: this.winningPlayers,
            };
        }

        return null;
    }
}
