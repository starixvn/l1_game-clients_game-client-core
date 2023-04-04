import { Container } from "inversify";
import { GameSetting } from "../../../../../src/core/game-setting";
import { getContainer, registerGameModules } from "../../../../../src/index";
import { PlayerStore } from "../../../../../src/players";
import { SocketIOConnector } from "../../../../../src/socket-io";
import { reaction } from "mobx";
import { RoundTimeStore } from "../../../../../src/core/rounds/round-time-store";
import { IContainer } from "../../../../../src/common";
import { SocketIOStore } from "../../../../../src/socket-io/socket-io-store";
import { DragonTigerGameHtmlView } from "./dragon-tiger-game-html-view";
import { RoundStore } from "../../../../../src/core/rounds/round-store";

export class DragonTigerGameController {
  container: Container;
  gameServiceUrl = "http://localhost:3000";
  gameSetting: GameSetting = {
    id: 7,
    name: "DragonTiger",
    durations: {
      wholeRound: 29,
      lockingBet: 5,
      placingBet: 20,
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
    const mainGame = this.container.resolve(DragonTigerGameHtmlView);

    mainGame.onLoad();
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
    player.name = "dragon-tiger-player";
    player.ss = "player-ss-dragon-tiger";
    player.signIn(socketIOStore.connection);
  }
}
