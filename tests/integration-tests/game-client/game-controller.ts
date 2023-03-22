import { GameStore } from "./../../../src/core/game-store";
import { GameSetting } from "./../../../src/core/game-setting";
import { IContainer } from "./../../../src/common/interface";
import { container, startup } from "../../../src/index";
import { PlayerStore } from "../../../src/players";
import { SocketIOConnector } from "../../../src/socket-io";
import { reaction, makeAutoObservable } from "mobx";
import { RoundTimeStore } from "../../../src/core/round-time/round-time-store";

export class GameController {
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
    this.init();
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
        console.log(
          `Round Time: ${roundTime}, Round State: ${roundTimeStore._roundState}`
        );
      }
    );
  }

  init() {
    function makeObservableFn(...params: any[]) {
      makeAutoObservable(params[0]);
    }
    container.bind("makeObservable").toFunction(makeObservableFn);
    container.bind(GameSetting).toConstantValue(this.gameSetting);

    startup(container as IContainer);
  }

  connectGameService() {
    const handler = container.resolve(SocketIOConnector);
    handler.handle({
      socketUri: "http://localhost:3000",
    });
  }

  joinGame() {
    const player = container.resolve(PlayerStore);
    player.name = "ricky.nguyen";
    player.ss = "ricky-ss";
    player.signIn();
  }
}
