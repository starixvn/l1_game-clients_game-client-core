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
    proxyRoute: "",
    wsPath: "sedie",
};

const domainMapper = window.envConfig ? undefined : defaultConfig.serverDomainMapper;
const configs: gc.SiteConfigs.Configs =
    window.envConfig && window.envConfig.isDev
        ? defaultConfig
        : { ...defaultConfig, serverDomainMapper: domainMapper, ...window.envConfig };

export default configs;
