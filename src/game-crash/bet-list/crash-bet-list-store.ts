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

interface IPlayer {
    playerId: string;
    name: string;
    amount: number;
    cashOut?: GameCrashServiceMessage.CashOutReceive;
    halfCashOut?: GameCrashServiceMessage.CashOutReceive;
    rate?: number;
    time?: string | number | Date;
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
        this._betList.players.forEach((player: IPlayer) => {
            (player["cashOut"] || player["halfCashOut"]) && players.push(player);
        });
        return players.length;
    }

    addBetList(data: ICrashBetList, isReceivedBetListData = false) {
        let players = [];
        Object.keys(data).forEach((key) => {
            data[key].amount = NumberUtils.getValueByCurrency(data[key].amount, this.mainPlayerStore.rate, data[key].rate);
            players.push(data[key]);
        });

        let playerList = [];

        if (isReceivedBetListData) {
            playerList = players.concat(...this._betList.players).sort((player1: IPlayer, player2: IPlayer) => {
                const time1 = new Date(player1.time).getTime();
                const time2 = new Date(player2.time).getTime();
                return time2 - time1;
            });
        } else {
            playerList = players.concat(...this._betList.players).sort((player1, player2) => player2.amount - player1.amount);
        }

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
