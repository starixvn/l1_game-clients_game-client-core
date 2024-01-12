import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage, LeaderBoardPlayer } from "../game-crash-messages";

export interface ICrashBetList {
    [playerId: string]: any;
}

export interface IPlayer {
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
    private _betList: GameCrashServiceMessage.CrashOtherPlayer[] = [];
    private _mainPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;

    constructor() {
        makeAutoObservable(this);
    }

    set betList(value: GameCrashServiceMessage.CrashOtherPlayer[]) {
        this._betList = value;
    }

    get betList(): GameCrashServiceMessage.CrashOtherPlayer[] {
        return this._betList;
    }

    get otherPlayers(): LeaderBoardPlayer[] {
        const otherPlayer = [];
        this.betList.forEach((player) => {
            const { name, amount, halfCashOut, cashOut } = player;
            const calcAmount = halfCashOut?.amount || cashOut?.amount || amount;
            const multiplier = halfCashOut?.multiplier || cashOut?.multiplier;
            const win = halfCashOut?.win || cashOut?.win;

            const data = {
                name,
                amount: calcAmount,
                multiplier,
                win,
            };
            otherPlayer.push(data);
        });
        return otherPlayer;
    }

    set mainPlayer(value: GameCrashServiceMessage.CrashOtherPlayer) {
        this._mainPlayer = value;
    }

    get mainPlayer(): GameCrashServiceMessage.CrashOtherPlayer {
        return this._mainPlayer;
    }

    private groupPlayersByName(playerList: any) {
        const playerByGroup = _.groupBy(playerList, (item) => item.name);
        return Object.keys(playerByGroup).length;
    }

    get noOfPlayerBet(): number {
        const countMainPlayer = this.mainPlayer ? 1 : 0;
        return this.groupPlayersByName(this.otherPlayers) + countMainPlayer;
    }

    get noOfPlayerCashOut(): number {
        const players = [];
        this.otherPlayers.forEach((player: GameCrashServiceMessage.CrashOtherPlayer) => {
            player.win > 0 && players.push(player);
        });
        const countMainPlayer = this.mainPlayer?.cashOut || this.mainPlayer?.halfCashOut ? 1 : 0;
        return this.groupPlayersByName(players) + countMainPlayer;
    }

    get totalCashOut(): number {
        let otherPlayersCashOut = 0;

        this.otherPlayers.forEach((player) => {
            otherPlayersCashOut += player?.win ?? 0;
        });

        const mainPlayerCashOut = (this.mainPlayer?.cashOut?.win ?? 0) + (this.mainPlayer?.halfCashOut?.win ?? 0);

        return otherPlayersCashOut + mainPlayerCashOut;
    }
}
