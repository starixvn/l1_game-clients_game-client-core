export class SiteConfigs {
    systemType: string;
    ssl: boolean;
    serverDomainMapper?: { [key: string]: string };
    subDomain: string;
    env: string;
    sentryUrl?: string;
    subGuideDomain: string;
    enableMsgpackParserAllGames: boolean;
    enableMsgpackParserOnNotification: boolean;
    websocket: {
        proxyPath: string;
        route: string;
    };
    subDirectory?: string;
    isDev?: boolean;
    userServiceUrlDev?: string;
    SGConnectSubDomain?: string;
    notificationServiceUrlDev?: string;
    gameGuideUrlDev?: string;
    mainObserverNamespace: string;
    tolgee?: {
        defaultLanguage: string;
        availableLanguages?: string[];
        defaultNs?: string;
        apiKey?: string;
        apiUrl?: string;
        projectId?: string;
        ns?: string[];
    };
}
