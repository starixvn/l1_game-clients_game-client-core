import { Configs, GameConfigs, IContainerOptions, getContainer } from "game-client-base";
import * as mobx from "mobx";
import Observer from "observer";
import { siteConfigs } from "../../configs/site-configs";
import { DragonTigerGameController } from "./dragon-tiger-controller";

const gameSetting: GameConfigs.GameSetting = {
    id: 7,
    name: "DragonTiger",
    durations: {
        wholeRound: 29,
        lockingBet: 5,
        placingBet: 20,
    },
};

const containerOptions: IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(GameConfigs.GameSetting).toConstantValue(gameSetting);
        container.bind(Configs.SiteConfigs).toConstantValue(siteConfigs);
    },
};

const container = getContainer(containerOptions);
const controller = new DragonTigerGameController(container);

Observer.configure({ dragonTiger: { mobx, container } });

controller.start();
