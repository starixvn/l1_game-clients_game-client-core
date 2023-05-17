import { Container } from "inversify";
import { Auth, Player } from "../../../src";
import { SiteConfigs } from "../../../src/configs";
import { IContainerOptions, getContainer } from "../../../src/container";
import { GameSetting } from "../../../src/game/game-configs";
import { gameSettings, siteConfigs } from "./setting";

const getSharedContainer = () => {
    const containerOptions: IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(SiteConfigs).toConstantValue(siteConfigs);
            container.bind(GameSetting).toConstantValue(gameSettings);
        },

        enabledFeatures: [Player.FEATURE_NAME, Auth.FEATURE_NAME],
    };

    return getContainer(containerOptions);
};

let container: Container;
let globalContainer: Container;

export const initContainer = () => {
    globalContainer = getSharedContainer();
    const containerOptions: IContainerOptions = {
        globalContainer,
        onContainerCreated: (container) => {
            container.bind(GameSetting).toConstantValue(gameSettings);
            container.bind(SiteConfigs).toConstantValue(siteConfigs);
        },
    };
    container = getContainer(containerOptions);
    return { globalContainer, container };
};
export { container, globalContainer };
