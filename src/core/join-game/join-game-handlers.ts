import { GameStore } from "../game-store";
import { inject, injectable } from "inversify";
import { IMultipleHandlers } from "../../common";
import { nameof } from "ts-simple-nameof";
import { IGameServiceMessage } from "../../models/game-messages";

@injectable()
export class JoinGameHandlers implements IMultipleHandlers {
  constructor(@inject(GameStore) protected readonly gameStore: GameStore) {}

  eventHandleList = [
    {
      name: nameof<IGameServiceMessage>((receiveData) => receiveData.toGame),
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
