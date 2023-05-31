import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../shared";

@injectable()
export class OtherPlayersStore {
    constructor() {
        makeAutoObservable(this);
    }

    player: GameServiceMessage.Player = null;
    players: GameServiceMessage.Players = null;

    updatePlayer(player: GameServiceMessage.Player) {
        this.player = player;
        this.players[player.id] = player;
    }

    removePlayer(player: GameServiceMessage.OutGame) {
        delete this.players[player.playerId];
    }

    resetOtherPlayersStore() {
        this.player = null;
        this.players = null;
    }
}
