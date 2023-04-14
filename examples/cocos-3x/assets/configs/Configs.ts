import gc from "game-client-base";

declare global {
    interface Window {
        envConfig: gc.Config.Configs;
    }
}

const defaultConfig: gc.Config.Configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
    },
    subDomain: "l1-proxy",
    env: "LOCAL",
    subGuideDomain: "l1-guide",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false,
};

const domainMapper = window.envConfig ? undefined : defaultConfig.serverDomainMapper;
const configs: gc.Config.Configs =
    window.envConfig && window.envConfig.isDev
        ? defaultConfig
        : { ...defaultConfig, serverDomainMapper: domainMapper, ...window.envConfig };

export default configs;
