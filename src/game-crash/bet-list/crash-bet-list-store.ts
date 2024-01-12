import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

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
    private _betList: GameCrashServiceMessage.CrashOtherPlayerList = { players: [] };
    private _mainPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;
    private _isNeedEmptyBetAmount = false;

    constructor() {
        makeAutoObservable(this);
    }

    set isNeedEmptyBetAmount(value: boolean) {
        this._isNeedEmptyBetAmount = value;
    }

    get isNeedEmptyBetAmount() {
        return this._isNeedEmptyBetAmount;
    }

    set betList(value: GameCrashServiceMessage.CrashOtherPlayerList) {
        this._betList = value;
    }

    get betList(): GameCrashServiceMessage.CrashOtherPlayerList {
        return this._betList;
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
        return this.groupPlayersByName(this.betList.players) + countMainPlayer;
    }

    get noOfPlayerCashOut(): number {
        const players = [];
        this.betList.players.forEach((player: IPlayer) => {
            (player.cashOut || player.halfCashOut) && players.push(player);
        });
        const countMainPlayer = this.mainPlayer?.cashOut || this.mainPlayer?.halfCashOut ? 1 : 0;
        return this.groupPlayersByName(players) + countMainPlayer;
    }

    get totalCashOut(): number {
        let otherPlayersCashOut = 0;

        this.betList.players.forEach((player: IPlayer) => {
            const { cashOut, halfCashOut } = player;
            const win = (cashOut?.win ?? 0) || (halfCashOut?.win ?? 0);

            otherPlayersCashOut += win;
        });

        const mainPlayerCashOut = (this.mainPlayer?.cashOut?.win ?? 0) + (this.mainPlayer?.halfCashOut?.win ?? 0);

        return otherPlayersCashOut + mainPlayerCashOut;
    }
}
