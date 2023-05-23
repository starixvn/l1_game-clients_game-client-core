import { inject, injectable } from "inversify";
import { SiteConfigs } from "../configs";
import { UrlUtils } from "../shared/utils";
import { io } from "socket.io-client/dist/socket.io.js";
import { ISessionInfo } from "../auth";
import { NotificationStore } from "./notification-store";

@injectable()
export class NotificationHandlers {
    constructor(
        @inject(NotificationStore) readonly notificationStore: NotificationStore,
        @inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs
    ) {}

    handle(sessionInfo: ISessionInfo) {
        const { isDev, enableMsgpackParserAllGames } = this.siteConfigs;
        const socketUri = isDev ? this.siteConfigs.notificationServiceUrlDev : UrlUtils.buildUrl("http", "/", this.siteConfigs);

        const options = {
            path: `${isDev ? "" : "/notification"}/socket.io`,
            socketUri,
            transports: ["websocket"],
            upgrade: false,
            forceNew: true,
            parser: enableMsgpackParserAllGames,
            auth: {
                ss: sessionInfo.session,
                username: sessionInfo.username,
            },
        };
        this.notificationStore.connection = io(options.socketUri, options);
        this.notificationStore.initListener();
    }
}
