import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { MainPlayerStore } from "../../players/main-player-store";
import { NumberUtils } from "../../shared/utils";
import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class OtherPlayerStore {
    constructor(
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore
    ) {
        makeAutoObservable(this);
    }

    _otherPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;

    public set otherPlayer(data: GameCrashServiceMessage.CrashOtherPlayer) {
        const { halfCashOut, cashOut } = data;

        if (halfCashOut) {
            halfCashOut.win = NumberUtils.getValueByCurrency(halfCashOut.win, this.mainPlayerStore.rate, data.rate);
        }

        if (cashOut) {
            cashOut.win = NumberUtils.getValueByCurrency(cashOut.win, this.mainPlayerStore.rate, data.rate);
        }

        this._otherPlayer = data;
    }

    public get otherPlayer() {
        return this._otherPlayer;
    }
}
