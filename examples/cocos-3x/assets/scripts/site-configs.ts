import gc from "game-client-base";

declare global {
    interface Window {
        envConfig: gc.Configs.SiteConfigs;
    }
}

const defaultConfig: gc.Configs.SiteConfigs = {
    // isDev: true, // if this property is true, then you should add token=anything into the querytring to sso to the game http://localhost:7456/?token=anything
    // systemType: "SC1",
    // ssl: false,
    serverDomainMapper: {
        localhost: "lumigame.com",
        // localhost: "localhost:5002",
    },
    // subDomain: "",
    // env: "LOCAL",
    // subGuideDomain: "l1-guide",
    // SGConnectSubDomain: "connectsite",
    // enableMsgpackParserAllGames: false,
    // enableMsgpackParserOnNotification: false,
    // userServiceUrlDev: "http://localhost:3000/user",
    // websocket: {
    //     proxyPath: "sedie",
    //     route: "",
    // },
    systemType: "SC1",
    ssl: true,
    subDomain: "l1-proxy",
    env: "LOCAL",
    // sentry: "https://2af29bdacdbf4d9ba2db6600b450541f@sentry.lumigame.com/28",
    subGuideDomain: "l1-guide",
    SGConnectSubDomain: "connectsite",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false,
    websocket: {
        proxyPath: "sedie",
        route: "sedie",
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

export const siteConfigs: gc.Configs.SiteConfigs =
    window.envConfig && window.envConfig.isDev ? defaultConfig : { ...defaultConfig, ...configDev, ...window.envConfig };
