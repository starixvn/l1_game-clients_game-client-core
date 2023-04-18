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

let configDev = {
    isDev: defaultConfig.isDev,
    userServiceUrlDev: defaultConfig.userServiceUrlDev,
    serverDomainMapper: defaultConfig.serverDomainMapper,
};

if (window.envConfig) {
    configDev = {
        isDev: undefined,
        userServiceUrlDev: undefined,
        serverDomainMapper: undefined,
    };
}

const configs: gc.SiteConfigs.Configs =
    window.envConfig && window.envConfig.isDev ? defaultConfig : { ...defaultConfig, ...configDev, ...window.envConfig };

export default configs;
