import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../shared";

@injectable()
export class AroundTablePlayersStore {
    constructor() {
        makeAutoObservable(this);
    }

    aroundTablePlayer: GameServiceMessage.AroundTablePlayer | null = null;
    aroundTablePlayers: GameServiceMessage.AroundTablePlayers = {};
    aroundTablePlayerIdOutGame = "";

    updateAroundTablePlayer(aroundTablePlayer: GameServiceMessage.AroundTablePlayer) {
        const { id } = aroundTablePlayer ?? {};

        if (id) {
            this.aroundTablePlayer = aroundTablePlayer;
            this.aroundTablePlayers[id] = aroundTablePlayer;
        }
    }

    removeAroundTablePlayer(aroundTablePlayer: GameServiceMessage.OutGame) {
        if (aroundTablePlayer?.playerId) {
            this.aroundTablePlayerIdOutGame = aroundTablePlayer.playerId;
            delete this.aroundTablePlayers?.[aroundTablePlayer.playerId];
        }
    }

    resetAroundTablePlayersStore() {
        this.aroundTablePlayer = null;
        this.aroundTablePlayers = {};
    }
}
