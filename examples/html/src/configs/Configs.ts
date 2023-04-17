import gc from "game-client-base";

const configs: gc.SiteConfigs.Configs = {
    isDev: true,
    systemType: "SC1",
    ssl: false,
    serverDomainMapper: {
        localhost: "localhost:5002",
    },
    subDomain: "",
    env: "",
    subGuideDomain: "l1-guide",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false,
    optionsDev: {
        userServiceUrl: "http://localhost:3000/user",
        gameConfigurationUrl: "http://l1-proxy.lumigame.com/game/configurations/",
    },
};

export default configs;
