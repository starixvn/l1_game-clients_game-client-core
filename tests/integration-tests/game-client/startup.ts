import "reflect-metadata";
import { MainGame } from "./views/main-game";
import { GameController } from "./game-controller";
import { IContainer } from "./../../../src/common/interface";
import { container, startup } from "../../../src/index";
import * as mobx from "mobx";
import { GameSetting } from "./../../../src/core/game-setting";
import Observer from "observer";
const gameController = new GameController();

function init() {
  container.bind(GameSetting).toConstantValue(gameController.gameSetting);

  startup(container as IContainer);
}

init();

Observer.configure({
  default: { mobx, container },
});

// Temporary simulator engine life cycle
const mainGame = container.get(MainGame);
mainGame.onLoad();

gameController.start();
