import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
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
    winningPlayers: GameServiceMessage.TWinningPlayers = null;
    private _isFinishedShowResult = false;
    public get isFinishedShowResult() {
        return this._isFinishedShowResult;
    }
    public set isFinishedShowResult(value) {
        this._isFinishedShowResult = value;
    }

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        this.isFinishedShowResult = false;
        finish?.roundId && (this.roundId = finish.roundId);
        finish?.result && (this.result = finish.result);
        finish?.settlementResult && (this.settlementResult = finish.settlementResult);
        finish?.winningPlayers && (this.winningPlayers = finish.winningPlayers);
    }

    constructor() {
        makeAutoObservable(this);
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

    resetSettlementStore() {
        this.winningPlayers = null;
        this.settlementResult = null;
    }
}
