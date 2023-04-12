import "reflect-metadata";

import { getContainer, registerSharedModules } from "game-client-base";
import * as mobx from "mobx";
import Observer from "observer";
import { DragonTigerGameController } from "./games/dragon-tiger/dragon-tiger-controller";
import { SedieGameController } from "./games/sedie/sedie-game-controller";

const userServiceUrl = "http://localhost:3000/user";
const defaultContainer = getContainer();
registerSharedModules(defaultContainer, userServiceUrl);

const sedieGameController = new SedieGameController();
sedieGameController.init();

const dragonTigerGameController = new DragonTigerGameController();
dragonTigerGameController.init();

Observer.configure({
    sedie: {
        mobx,
        container: sedieGameController.container
    },
    dragonTiger: {
        mobx,
        container: dragonTigerGameController.container
    }
});

sedieGameController.start();
dragonTigerGameController.start();
