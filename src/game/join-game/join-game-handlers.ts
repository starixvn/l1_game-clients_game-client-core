import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameStore } from "../game-store";

@injectable()
export class JoinGameHandlers implements IMultipleHandlers {
  constructor(@inject(GameStore) protected readonly gameStore: GameStore) {}

  eventHandleList = [
    {
      name: GameServiceMessage.toGame,
      handle: this.handleToGame.bind(this),
    },
  ];

  handleToGame(toGame: string) {
    if (toGame && toGame != "") {
      console.log(toGame);
      this.gameStore.toGame(toGame);
    }
  }
}
