import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

export type TPayChipInfo = {
    settlementResult: GameServiceMessage.TSettlementResult;
    winningPlayers: GameServiceMessage.TWinningPlayers;
};

@injectable()
export class SettlementStore {
    constructor() {
        makeAutoObservable(this);
    }

    roundId = 0;
    result: GameServiceMessage.TResult = null;
    settlementResult: GameServiceMessage.TSettlementResult = null;
    private _winningPlayers: GameServiceMessage.TWinningPlayers = null;
    private _isFinishedShowResult = false;

    public get isFinishedShowResult() {
        return this._isFinishedShowResult;
    }

    public set isFinishedShowResult(value) {
        this._isFinishedShowResult = value;
    }

    get winningPlayers() {
        return this._winningPlayers;
    }

    set winningPlayers(winningPlayers: GameServiceMessage.TWinningPlayers) {
        !_.isEmpty(winningPlayers) && (this._winningPlayers = winningPlayers);
    }

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        this.isFinishedShowResult = false;
        finish?.roundId && (this.roundId = finish.roundId);
        finish?.result && (this.result = finish.result);
        finish?.settlementResult && (this.settlementResult = finish.settlementResult);
        finish?.winningPlayers && (this.winningPlayers = finish.winningPlayers);
    }

    get payChipInfo(): TPayChipInfo {
        if (this.isFinishedShowResult && this.winningPlayers) {
            return {
                settlementResult: this.settlementResult,
                winningPlayers: this.winningPlayers,
            };
        }

        return null;
    }

    resetSettlementStore() {
        this._winningPlayers = null;
        this.settlementResult = null;
    }
}
