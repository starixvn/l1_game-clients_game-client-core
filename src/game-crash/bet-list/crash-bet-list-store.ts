import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { NumberUtils } from "../../exports";
import { BetStore } from "../../game/bets/bet-store";
import { RoundTimeStore } from "../../game/rounds";
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
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) private readonly betStore: BetStore
    ) {
        makeAutoObservable(this);
    }

    get betList(): GameCrashServiceMessage.CrashOtherPlayerList {
        return this._betList;
    }

    get roundTime(): number {
        return this.roundTimeStore.roundTime;
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

    get noOfPlayerBet(): number {
        const countMainPlayer = this.mainPlayer.amount ? 1 : 0;
        return this._betList.players.length + countMainPlayer;
    }

    get noOfPlayerCashOut() {
        const players = [];
        this._betList.players.forEach((player) => {
            (player["cashOut"] || player["halfCashOut"]) && players.push(player);
        });
        return players.length;
    }

    addBetList(data: ICrashBetList) {
        let players = [];
        Object.keys(data).forEach((key) => {
            data[key].amount = NumberUtils.getValueByCurrency(data[key].amount, this.mainPlayerStore.rate, data[key].rate);
            players.push(data[key]);
        });
        const playerList = players.concat(...this._betList.players).sort((a, b) => b.amount - a.amount);
        this._betList = {
            players: playerList,
        };
    }

    resetOtherPlayerList() {
        this._betList = { players: [] };
    }

    updateBetListCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const existedPlayer = this._betList.players.find((player) => player.playerId === otherPlayer.playerId);
        if (!existedPlayer) {
            return;
        }

        if (otherPlayer.halfCashOut) {
            existedPlayer["halfCashOut"] = otherPlayer.halfCashOut;
        }

        if (otherPlayer.cashOut) {
            existedPlayer["cashOut"] = otherPlayer.cashOut;
        }

        const newPlayers = this._betList.players.filter((player) => player.playerId !== otherPlayer.playerId);
        this._betList = {
            players: [existedPlayer, ...newPlayers],
        };
    }
}
