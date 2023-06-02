import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../shared";

@injectable()
export class OtherPlayersStore {
    constructor() {
        makeAutoObservable(this);
    }

    player: GameServiceMessage.Player | null = null;
    players: GameServiceMessage.Players = {};

    updatePlayer(player: GameServiceMessage.Player) {
        const { id } = player ?? {};

        if (id) {
            this.player = player;
            this.players[id] = player;
        }
    }

    removePlayer(player: GameServiceMessage.OutGame) {
        if (player?.playerId) {
            delete this.players?.[player.playerId];
        }
    }

    resetOtherPlayersStore() {
        this.player = null;
        this.players = null;
    }
}
