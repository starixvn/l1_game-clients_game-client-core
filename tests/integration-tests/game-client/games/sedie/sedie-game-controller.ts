import { Container } from "inversify";
import { GameSetting } from "../../../../../src/core/game-setting";
import { getContainer, registerGameModules } from "../../../../../src/index";
import { PlayerStore } from "../../../../../src/players";
import { SocketIOConnector } from "../../../../../src/socket-io";
import { reaction } from "mobx";
import { RoundTimeStore } from "../../../../../src/core/rounds/round-time-store";
import { IContainer } from "../../../../../src/common";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";
import { SocketIOStore } from "../../../../../src/socket-io/socket-io-store";
import { RoundStore } from "../../../../../src/core";

export class SedieGameController {
  container: Container;
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

  init() {
    const rootContainer = getContainer();
    this.container = getContainer(this.gameSetting.name);
    this.container.bind(GameSetting).toConstantValue(this.gameSetting);
    registerGameModules(this.container as IContainer);
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
    const roundTimeStore = this.container.resolve(RoundTimeStore);
    const roundStore = this.container.resolve(RoundStore);
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
    const handler = this.container.resolve(SocketIOConnector);
    handler.handle({
      socketUri: this.gameServiceUrl,
    });
  }

  joinGame() {
    const player = this.container.resolve(PlayerStore);
    const socketIOStore = this.container.get(SocketIOStore);
    player.ss = "player-ss-sedie";
    player.signIn(socketIOStore.connection);
  }
}
