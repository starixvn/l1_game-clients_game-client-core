import gc from "@sg/game-client-base";

export const siteConfigs: gc.Configs.SiteConfigs = {
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
    notificationServiceUrlDev: "https://localhost:3008",
    websocket: {
        proxyPath: "sedie",
        route: "",
    },
};
