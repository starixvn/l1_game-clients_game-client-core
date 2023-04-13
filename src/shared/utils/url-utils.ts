export namespace UrlUtils {
    interface IServerDomainMapper {
        [key: string]: string;
    }

    export const buildUrl = (protocol = "http", path = "/", ssl = false, subDomain: string, serverDomainMapper: IServerDomainMapper) => {
        const domain = getRootDomain(serverDomainMapper);
        const subDomainText = `${subDomain}.`;

        return `${protocol}${ssl ? "s" : ""}://${subDomain === "" ? "" : subDomainText}${domain}${path}`;
    };

    export const getRootDomain = (serverDomainMapper: IServerDomainMapper) => {
        const hostName = window.location.hostname;
        return (!!serverDomainMapper && serverDomainMapper[hostName]) || extractDomainFromHostName(hostName);
    };

    export const extractDomainFromHostName = (hostName: string) => {
        const domainParts = hostName.split(".").reverse();
        return `${domainParts[1]}.${domainParts[0]}`;
    };

    export const buildGameGuideUrl = (ssl = false, serverDomainMapper: IServerDomainMapper, subGuideDomain: string) => {
        const rootDomain = getRootDomain(serverDomainMapper);
        const subGuideDomainText = `${subGuideDomain}.`;

        return `${"http"}${ssl ? "s" : ""}://${subGuideDomainText}${rootDomain}`;
    };
}
