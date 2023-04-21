import { SiteConfigs } from "../../src/configs/site-configs";
import { IContainerOptions, getContainer } from "../../src/container";
import { GameSetting } from "../../src/game/game-configs";

export const gameSettings = {
    id: 1,
    name: "SeDie",
    durations: {
        wholeRound: 39,
        lockingBet: 5,
        placingBet: 30,
    },
};

export const siteConfigs: SiteConfigs = {
    isDev: true,
    systemType: "SC1",
    ssl: false,
    serverDomainMapper: {
        localhost: "localhost:5002",
    },
    subDomain: "",
    env: "LOCAL",
    subGuideDomain: "l1-guide",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false,
    userServiceUrlDev: "http://localhost:3000/user",
    websocket: {
        proxyPath: "sedie",
        route: "",
    },
};

const containerOptions: IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(GameSetting).toConstantValue(gameSettings);
        container.bind(SiteConfigs).toConstantValue(siteConfigs);
    },
};

const container = getContainer(containerOptions);
const makeObservable = jest.fn();
container.bind("makeObservable").toFunction(makeObservable);

export default container;
