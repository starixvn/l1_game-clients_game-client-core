import gc from "game-client-base";

declare global {
    interface Window {
        envConfig: gc.SiteConfigs.Configs;
    }
}

const defaultConfig: gc.SiteConfigs.Configs = {
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

const domainMapper = window.envConfig ? undefined : defaultConfig.serverDomainMapper;
const configs: gc.SiteConfigs.Configs =
    window.envConfig && window.envConfig.isDev
        ? defaultConfig
        : { ...defaultConfig, serverDomainMapper: domainMapper, ...window.envConfig };

export default configs;
