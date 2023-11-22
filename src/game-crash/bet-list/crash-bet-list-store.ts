import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

export interface ICrashBetList {
    [playerId: string]: any;
}

@injectable()
export class CrashBetListStore {
    private _betList: GameCrashServiceMessage.CrashOtherPlayerList = { players: [] };

    constructor() {
        makeAutoObservable(this);
    }

    get betList() {
        return this._betList;
    }

    set betList(data: ICrashBetList) {
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
