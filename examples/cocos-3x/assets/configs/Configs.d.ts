interface IConfigs {
    systemType: string;
    ssl: boolean;
    serverDomainMapper: { [key: string]: string };
    subDomain: string;
    env: string;
    sentry: { [key: string]: string };
    gameAnalytics: { [key: string]: string };
    subGuideDomain: string;
    enableMsgpackParserAllGames: boolean;
    enableMsgpackParserOnNotification: boolean;
    isDev?: boolean;
}

export default IConfigs;
