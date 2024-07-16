import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

interface EventData {
    event: string;
    winAmount: number;
}

export enum SettlementAction {
    TOTAL_WIN = "total-win",
}

@injectable()
export class SettlementStatusStore {
    win = false;
    bet = 0;
    winningByChoices: GameServiceMessage.WinningByChoices = {};
    reachMaxWin = false;
    private _eventData: EventData = null;

    constructor() {
        makeAutoObservable(this);
    }

    setStatusStore(status: GameServiceMessage.Status) {
        this.win = status.win;
        this.bet = status.bet;
        this.winningByChoices = status.winningByChoices;
        this.reachMaxWin = status.reachMaxWin ?? false;
    }

    resetSettlementStatus() {
        this.win = false;
        this.bet = 0;
        this.reachMaxWin = false;
        this.eventData = null;
    }

    get settlementStatus(): GameServiceMessage.Status {
        return {
            win: this.win,
            bet: this.bet,
            winningByChoices: this.winningByChoices,
            reachMaxWin: this.reachMaxWin,
        };
    }

    public get eventData(): EventData {
        return this._eventData;
    }
    public set eventData(value: EventData) {
        this._eventData = value;
    }
}
