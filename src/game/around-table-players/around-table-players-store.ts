import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class AroundTablePlayersStore {
    constructor() {
        makeAutoObservable(this);
    }

    aroundTablePlayer: GameServiceMessage.AroundTablePlayer = null;
    aroundTablePlayers: GameServiceMessage.AroundTablePlayers = {};
    outGamePlayerId = "";

    updateAroundTablePlayer(aroundTablePlayer: GameServiceMessage.AroundTablePlayer) {
        if (aroundTablePlayer?.id) {
            this.aroundTablePlayer = aroundTablePlayer;
            this.aroundTablePlayers[aroundTablePlayer.id] = aroundTablePlayer;
        }
    }

    removeAroundTablePlayer(aroundTablePlayer: GameServiceMessage.OutGame) {
        if (aroundTablePlayer?.playerId) {
            this.outGamePlayerId = aroundTablePlayer.playerId;
            delete this.aroundTablePlayers[aroundTablePlayer.playerId];
        }
    }

    resetAroundTablePlayersStore() {
        this.aroundTablePlayer = null;
        this.aroundTablePlayers = {};
    }
}
