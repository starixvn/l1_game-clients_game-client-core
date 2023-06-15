import { Configs, GameConfigs, IContainerOptions, getContainer } from "@sg/game-client-base";
import * as mobx from "mobx";
import Observer from "observer";
import { siteConfigs } from "../../configs";
import { SedieGameController } from "./sedie-game-controller";

const gameSetting: GameConfigs.GameSetting = {
    id: 2,
    name: "SeDie",
    durations: {
        wholeRound: 39,
        lockingBet: 5,
        placingBet: 30,
        generatingResult: 2,
        startRound: 1,
    },
};

const containerOptions: IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(GameConfigs.GameSetting).toConstantValue(gameSetting);
        container.bind(Configs.SiteConfigs).toConstantValue(siteConfigs);
    },
};

const container = getContainer(containerOptions);
const controller = new SedieGameController(container);

Observer.configure({ sedie: { mobx, container } });

controller.start();
