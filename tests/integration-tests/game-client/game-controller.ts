import { GameSetting } from "./../../../src/core/game-setting";
import { container } from "../../../src/index";
import { PlayerStore } from "../../../src/players";
import { SocketIOConnector } from "../../../src/socket-io";
import { reaction } from "mobx";
import { RoundTimeStore } from "../../../src/core/round-time/round-time-store";

export class GameController {
  gameServiceUrl = "http://localhost:3000";
  gameSetting: GameSetting = {
    id: 1,
    name: "SeDie",
    durations: {
      wholeRound: 39,
      lockingBet: 5,
      placingBet: 30,
    },
  };

  start() {
    this.connectGameService();
    this.joinGame();
    this.logInfo();
  }

  logInfo() {
    const roundTimeStore = container.resolve(RoundTimeStore);
    reaction(
      () => roundTimeStore._beginState,
      (beginState) => {
        console.log(
          `Round Time: ${roundTimeStore._roundTime}, Begin State: ${beginState}`
        );
      }
    );

    reaction(
      () => roundTimeStore._roundTime,
      (roundTime) => {
        const message = `Round Time: ${roundTime}, Round State: ${roundTimeStore._roundState}`;
        console.log(message);
      }
    );
  }

  connectGameService() {
    const handler = container.resolve(SocketIOConnector);
    handler.handle({
      socketUri: this.gameServiceUrl,
    });
  }

  joinGame() {
    const player = container.resolve(PlayerStore);
    player.name = "ricky.nguyen";
    player.ss = "ricky-ss";
    player.signIn();
  }
}
