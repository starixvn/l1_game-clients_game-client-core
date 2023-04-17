export class Configs {
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
    optionsDev?: {
        userServiceUrl: string;
        gameConfigurationUrl: string;
    };
}
