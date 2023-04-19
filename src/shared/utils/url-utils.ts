import { SiteConfigs } from "../../site-configs";

export namespace UrlUtils {
    export const buildUrl = (protocol = "http", path = "/", configs: SiteConfigs) => {
        const ssl = configs.ssl;
        const domain = getRootDomain(configs);
        const subDomain = configs.subDomain;
        const subDomainText = `${subDomain}.`;

        return `${protocol}${ssl ? "s" : ""}://${subDomain === "" ? "" : subDomainText}${domain}${path}`;
    };

    export const getRootDomain = (configs: SiteConfigs) => {
        const hostName = window.location.hostname;
        return (!!configs.serverDomainMapper && configs.serverDomainMapper[hostName]) || extractDomainFromHostName(hostName);
    };

    export const extractDomainFromHostName = (hostName: string) => {
        const domainParts = hostName.split(".").reverse();
        return `${domainParts[1]}.${domainParts[0]}`;
    };

    export const buildGameGuideUrl = (configs: SiteConfigs) => {
        const ssl = configs.ssl;
        const rootDomain = getRootDomain(configs);
        const subGuideDomainText = `${configs.subGuideDomain}.`;

        return `${"http"}${ssl ? "s" : ""}://${subGuideDomainText}${rootDomain}`;
    };

    export const buildUrlWithPath = (path: string, configs: SiteConfigs) => {
        return buildUrl("http", path, configs);
    };

    export const buildServerUrl = (protocol = "http", path = "/", gameId = 0, configs: SiteConfigs) => {
        const gamePath = getPath(gameId, path);
        return buildUrl(protocol, gamePath, configs);
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

    export const getProxyRoute = (configs: SiteConfigs) => {
        if (configs?.websocket?.route === "") {
            return "/socket.io";
        }

        const subDirectory = configs?.subDirectory ? `${configs?.subDirectory}/` : "";
        return `/${subDirectory}${configs?.websocket?.route}/socket.io`;
    };
}
