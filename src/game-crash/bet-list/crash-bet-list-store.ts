import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage, LeaderBoardPlayer } from "../game-crash-messages";

export interface ICrashBetList {
    [playerId: string]: GameCrashServiceMessage.CrashOtherPlayer;
}

@injectable()
export class CrashBetListStore {
    private _otherPlayers: LeaderBoardPlayer[] = [];
    private _mainPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;

    constructor() {
        makeAutoObservable(this);
    }

    set otherPlayers(value: LeaderBoardPlayer[]) {
        this._otherPlayers = value;
    }

    get otherPlayers(): LeaderBoardPlayer[] {
        return this._otherPlayers;
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
        this.otherPlayers.forEach((player: LeaderBoardPlayer) => {
            player.win > 0 && players.push(player);
        });
        const countMainPlayer = this.mainPlayer?.cashOut || this.mainPlayer?.halfCashOut ? 1 : 0;
        return this.groupPlayersByName(players) + countMainPlayer;
    }

    get totalCashOut(): number {
        let otherPlayersCashOut = 0;

        this.otherPlayers.forEach((player) => {
            otherPlayersCashOut += player.win;
        });

        const mainPlayerCashOut = (this.mainPlayer?.cashOut?.win ?? 0) + (this.mainPlayer?.halfCashOut?.win ?? 0);

        return otherPlayersCashOut + mainPlayerCashOut;
    }
}
