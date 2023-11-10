import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";
import { MainPlayerStore } from "../../players/main-player-store";
import { GameServiceMessage } from "../../shared";
import { NumberUtils } from "../../shared/utils/number-utils";

@injectable()
export class SettlementStore {
    constructor(@inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore) {
        makeAutoObservable(this);
    }

    roundId = 0;
    result: GameServiceMessage.TResult = null;
    settlementResult: GameServiceMessage.TSettlementResult = null;
    private _winningPlayers: GameServiceMessage.TWinningPlayers = null;
    private _isFinishedShowResult = false;
    currentFinish: GameServiceMessage.Finish = null;
    md5Result: GameServiceMessage.ResultHash;

    public get isFinishedShowResult() {
        return this._isFinishedShowResult;
    }

    public set isFinishedShowResult(value) {
        this._isFinishedShowResult = value;
    }

    get winningPlayers() {
        if (this._winningPlayers) {
            const winningPlayers = { ...this._winningPlayers };
            Object.values(winningPlayers).forEach(
                (winningPlayer) =>
                    (winningPlayer.bet = NumberUtils.getValueByCurrency(winningPlayer.bet, this.mainPlayerStore.rate, winningPlayer.rate))
            );
            return winningPlayers;
        }
        return this._winningPlayers;
    }

    set winningPlayers(winningPlayers: GameServiceMessage.TWinningPlayers) {
        !_.isEmpty(winningPlayers) && (this._winningPlayers = winningPlayers);
    }

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        this.currentFinish = finish;
        this.isFinishedShowResult = false;
        finish?.roundId && (this.roundId = finish.roundId);
        finish?.result && (this.result = finish.result);
        finish?.settlementResult && (this.settlementResult = finish.settlementResult);
        finish?.winningPlayers && (this.winningPlayers = finish.winningPlayers);
        finish?.md5Result && (this.md5Result = finish.md5Result);
    }

    resetSettlementStore() {
        this._winningPlayers = null;
        this.settlementResult = null;
        this.result = null;
        this.isFinishedShowResult = false;
    }
}
