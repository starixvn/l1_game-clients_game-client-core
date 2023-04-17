import { Configs, IGameConfiguration } from "../../site-configs";

export namespace UrlUtils {
    export const buildUrl = (protocol = "http", path = "/", configs: Configs) => {
        const ssl = configs.ssl;
        const domain = getRootDomain(configs);
        const subDomain = configs.subDomain;
        const subDomainText = `${subDomain}.`;

        return `${protocol}${ssl ? "s" : ""}://${subDomain === "" ? "" : subDomainText}${domain}${path}`;
    };

    export const getRootDomain = (configs: Configs) => {
        const hostName = window.location.hostname;
        return (!!configs.serverDomainMapper && configs.serverDomainMapper[hostName]) || extractDomainFromHostName(hostName);
    };

    export const extractDomainFromHostName = (hostName: string) => {
        const domainParts = hostName.split(".").reverse();
        return `${domainParts[1]}.${domainParts[0]}`;
    };

    export const buildGameGuideUrl = (configs: Configs) => {
        const ssl = configs.ssl;
        const rootDomain = getRootDomain(configs);
        const subGuideDomainText = `${configs.subGuideDomain}.`;

        return `${"http"}${ssl ? "s" : ""}://${subGuideDomainText}${rootDomain}`;
    };

    export const buildUrlWithPath = (path: string, configs: Configs) => {
        return buildUrl("http", path, configs);
    };

    export const buildServerUrl = (protocol = "http", path = "/", gameId = 0, configs: Configs, gameConfigurationKey: string) => {
        const gamePath = getPath(gameId, gameConfigurationKey, configs.env);
        return buildUrl(protocol, gamePath + path, configs);
    };

    export const buildProxyUrl = (path: string, configs: Configs) => {
        const envPath = configs.env === "" ? "" : `/${configs.env}`;
        const fullPath = `${envPath}${path}`;

        return buildUrl("http", fullPath, configs);
    };

    export const getPath = (gameId: number, path: string, env: string) => {
        path = path.toLowerCase();
        let pathStr = "";
        if (gameId === 0) {
            pathStr = `/${getEnvironment(env)}${path}`;
        } else {
            pathStr = `/user/${path}`;
        }

        return pathStr;
    };

    export const getProxyRoute = (gameConfiguration: IGameConfiguration, env: string) => {
        const route = gameConfiguration?.route || gameConfiguration?.key.toLowerCase();

        return `/${getEnvironment(env)}${route}/socket.io`;
    };

    export const getEnvironment = (env: string) => {
        let envStr = "";
        if (env.length > 0) {
            envStr = `${env}/`;
        }

        return envStr;
    };
}
