import "reflect-metadata";
import { SedieGameController } from "./games/sedie/sedie-game-controller";
import { IContainer } from "./../../../src/common/interface";
import { getContainer, registerSharedModules } from "../../../src/index";
import * as mobx from "mobx";
import Observer from "observer";
import { DragonTigerGameController } from "./games/dragon-tiger/dragon-tiger-controller";

const defaultContainer = getContainer();
registerSharedModules(defaultContainer as IContainer);

const sedieGameController = new SedieGameController();
sedieGameController.init();

const dragonTigerGameController = new DragonTigerGameController();
dragonTigerGameController.init();

Observer.configure({
  sedie: {
    mobx,
    container: sedieGameController.container,
  },
  dragonTiger: {
    mobx,
    container: dragonTigerGameController.container,
  },
});

sedieGameController.start();
dragonTigerGameController.start();
