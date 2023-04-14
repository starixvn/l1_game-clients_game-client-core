interface IConfigs {
    systemType: string;
    ssl: boolean;
    serverDomainMapper: { [key: string]: string };
    subDomain: string;
    env: string;
    sentryUrl?: string;
    subGuideDomain: string;
    enableMsgpackParserAllGames: boolean;
    enableMsgpackParserOnNotification: boolean;
    isDev?: boolean;
}

export default IConfigs;
