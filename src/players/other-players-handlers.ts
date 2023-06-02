import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../shared";
import { OtherPlayersStore } from "./other-players-store";

@injectable()
export class OtherPlayerHandlers implements IMultipleHandlers {
    constructor(@inject(OtherPlayersStore) protected readonly otherPlayersStore: OtherPlayersStore) {}

    handlePlayer(player: GameServiceMessage.Player) {
        this.otherPlayersStore.updatePlayer(player);
    }

    handlePlayers(players: GameServiceMessage.Players) {
        this.otherPlayersStore.players = players;
    }

    handlePlayerOutGame(playerOutGame: GameServiceMessage.OutGame) {
        playerOutGame && this.otherPlayersStore.removePlayer(playerOutGame);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Player.eventName,
            handle: this.handlePlayer,
        },
        {
            name: GameServiceMessage.Players.eventName,
            handle: this.handlePlayers,
        },
        {
            name: GameServiceMessage.OutGame.eventName,
            handle: this.handlePlayerOutGame,
        },
    ];
}
