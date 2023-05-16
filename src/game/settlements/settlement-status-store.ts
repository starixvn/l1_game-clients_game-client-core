import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class SettlementStatusStore {
    win = false;
    bet = 0;
    winningByChoices: GameServiceMessage.WinningByChoices = {};

    constructor() {
        makeAutoObservable(this);
    }

    setStatusStore(status: GameServiceMessage.Status) {
        this.win = status.win;
        this.bet = status.bet;
        this.winningByChoices = status.winningByChoices;
    }

    resetSettlementStatus() {
        this.win = false;
        this.bet = 0;
    }
}
