import { Configs } from "../../site-configs";

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

    export const buildServerUrl = (protocol = "http", path = "/", gameId = 0, configs: Configs) => {
        const gamePath = getPath(gameId, configs.wsPath);
        return buildUrl(protocol, gamePath + path, configs);
    };

    export const getPath = (gameId: number, path: string) => {
        path = path.toLowerCase();
        let pathStr = "";
        if (gameId === 0) {
            pathStr = `/${path}`;
        } else {
            pathStr = `/user/${path}`;
        }

        return pathStr;
    };

    export const getProxyRoute = (configs: Configs) => {
        if (configs.proxyRoute === "") {
            return "/socket.io";
        }

        const route = `${configs?.proxyRoute || configs.wsPath.toLowerCase()}/`;
        return `/${route}socket.io`;
    };
}
