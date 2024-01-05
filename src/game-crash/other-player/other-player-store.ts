import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class OtherPlayerStore {
    constructor() {
        makeAutoObservable(this);
    }

    _otherPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;

    public set otherPlayer(data: GameCrashServiceMessage.CrashOtherPlayer) {
        this._otherPlayer = data;
    }

    public get otherPlayer() {
        return this._otherPlayer;
    }
}
