import {
  Common,
  Core,
  Player,
  SocketIO,
  getContainer,
  registerGameModules,
} from "game-client-base";
import { Container } from "inversify";
import { reaction } from "mobx";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";

export class SedieGameController {
  container: Container;
  gameServiceUrl = "http://localhost:3000";
  gameSetting: Core.GameSetting = {
    id: 1,
    name: "SeDie",
    durations: {
      wholeRound: 39,
      lockingBet: 5,
      placingBet: 30,
    },
  };

  init() {
    const rootContainer = getContainer();
    this.container = getContainer(this.gameSetting.name);
    this.container.bind(Core.GameSetting).toConstantValue(this.gameSetting);
    registerGameModules(this.container as Common.IContainer);
    this.container.parent = rootContainer;
  }

  start() {
    this.connectGameService();
    this.joinGame();
    this.logInfo();
    const sedieView = this.container.resolve(SedieGameHtmlView);
    sedieView.onLoad();
  }

  logInfo() {
    const roundTimeStore = this.container.resolve(Core.RoundTimeStore);
    const roundStore = this.container.resolve(Core.RoundStore);
    reaction(
      () => roundTimeStore._beginState,
      (beginState) => {
        console.log(
          `${this.gameSetting.name}: RoundId: ${roundStore.roundId} Round Time: ${roundTimeStore._roundTime}, Begin State: ${beginState}`
        );
      }
    );

    reaction(
      () => roundTimeStore._roundTime,
      (roundTime) => {
        console.log(
          `${this.gameSetting.name}: RoundId: ${roundStore.roundId} Round Time: ${roundTime}, Round State: ${roundTimeStore._roundState}`
        );
      }
    );
  }

  connectGameService() {
    const handler = this.container.resolve(SocketIO.SocketIOConnector);
    handler.handle({
      socketUri: this.gameServiceUrl,
    });
  }

  joinGame() {
    const player = this.container.resolve(Player.PlayerStore);
    const socketIOStore = this.container.get(SocketIO.SocketIOStore);

    player.ss = "player-ss-sedie";
    player.signIn(socketIOStore.connection);
  }
}
