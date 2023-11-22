import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { BetStore } from "../../game/bets/bet-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { CrashCashoutStore } from "../cash-out/crash-cashout-store";
import { GameCrashServiceMessage } from "../game-crash-messages";

export interface ICrashBetList {
    [playerId: string]: any;
}

@injectable()
export class CrashBetListStore {
    private _betList: GameCrashServiceMessage.CrashOtherPlayerList = { players: [] };

    constructor(
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(CrashCashoutStore) private readonly crashCashoutStore: CrashCashoutStore,
        @inject(BetStore) private readonly betStore: BetStore
    ) {
        makeAutoObservable(this);
    }

    get betList() {
        return this._betList;
    }

    get mainPlayer(): GameCrashServiceMessage.CrashOtherPlayer {
        const bet = this.betStore.lastReceivedBet?.value;
        return {
            playerId: null,
            name: this.mainPlayerStore.name,
            amount: bet !== -1 ? bet : null,
            cashOut: this.crashCashoutStore.cashOut,
            halfCashOut: this.crashCashoutStore.halfCashOut,
        };
    }

    addBetList(data: ICrashBetList) {
        let players = [];
        Object.keys(data).forEach((key) => {
            players.push(data[key]);
        });
        const playerList = players.concat(...this._betList.players).sort((a, b) => b.amount - a.amount);
        this._betList = { players: playerList };
    }

    resetOtherPlayerList() {
        this._betList = { players: [] };
    }
}
