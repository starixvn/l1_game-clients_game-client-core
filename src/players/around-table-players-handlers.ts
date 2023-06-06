import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../shared";
import { AroundTablePlayersStore } from "./around-table-players-store";

@injectable()
export class AroundTablePlayerHandlers implements IMultipleHandlers {
    constructor(@inject(AroundTablePlayersStore) protected readonly otherPlayersStore: AroundTablePlayersStore) {}

    handlePlayer(aroundTablePlayer: GameServiceMessage.AroundTablePlayer) {
        this.otherPlayersStore.updateAroundTablePlayer(aroundTablePlayer);
    }

    handlePlayers(aroundTablePlayers: GameServiceMessage.AroundTablePlayers) {
        this.otherPlayersStore.aroundTablePlayers = aroundTablePlayers;
    }

    handlePlayerOutGame(aroundTablePlayerOutGame: GameServiceMessage.OutGame) {
        this.otherPlayersStore.removeAroundTablePlayer(aroundTablePlayerOutGame);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.AroundTablePlayer.eventName,
            handle: this.handlePlayer,
        },
        {
            name: GameServiceMessage.AroundTablePlayers.eventName,
            handle: this.handlePlayers,
        },
        {
            name: GameServiceMessage.OutGame.eventName,
            handle: this.handlePlayerOutGame,
        },
    ];
}
