import "reflect-metadata";
import { GameView } from "./views/game-view";
import { GameController } from "./game-controller";
import { IContainer } from "./../../../src/common/interface";
import { container, startup } from "../../../src/index";
import { makeAutoObservable, makeObservable } from "mobx";
import * as mobx from "mobx";
import { GameSetting } from "./../../../src/core/game-setting";
import Observer from "observer";
const gameController = new GameController();

function init() {
  function makeObservableFn(target, ...params: any[]) {
    if (params.length > 0 && params[0].isMakingAutoObservableManually) {
      makeObservable(target, params[0]);
    } else {
      makeAutoObservable(target, params[0]);
    }
  }
  container.bind("makeObservable").toFunction(makeObservableFn);
  container.bind(GameSetting).toConstantValue(gameController.gameSetting);

  startup(container as IContainer);
}

init();

Observer.configure({
  default: { mobx, container },
});

// Temporary simulator engine life cycle
const gameView = container.get(GameView);
gameView.onLoad();

gameController.start();
