import { inject, injectable } from "inversify";
import { SiteConfigs } from "../configs";
import { UrlUtils } from "../shared/utils";
import { AppStore } from "../app";
import { GameServiceMessage, IHandler } from "../shared";
import { io } from "socket.io-client/dist/socket.io.js";
import { ISessionInfo } from "../auth";
import { StorageManager, localStorageKeys } from "../shared/utils/storage-manager";
import { ConnectionStore } from "../game/connection";
import { NotificationStore } from "./notification-store";

export namespace NotificationHandlers {
    @injectable()
    export class SocketConnection {
        constructor(
            @inject(AppStore) protected readonly appStore: AppStore,
            @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
            @inject(NotificationStore) readonly notificationStore: NotificationStore,
            @inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs
        ) {}

        handle() {
            const { isDev, enableMsgpackParserAllGames } = this.siteConfigs;
            const socketUri = isDev ? this.siteConfigs.notificationServiceUrlDev : UrlUtils.buildUrl("http", "/", this.siteConfigs);

            const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
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
            this.notificationStore.initBaseListener();
        }
    }

    @injectable()
    export class UMHandler implements IHandler<GameServiceMessage.UnderMaintenanceInfo> {
        name = GameServiceMessage.UnderMaintenanceInfo.eventName;
        constructor(
            @inject(AppStore) protected readonly appStore: AppStore,
            @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
            @inject(NotificationStore) protected readonly notificationStore: NotificationStore,
            @inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs
        ) {}

        handle(underMaintenanceInfo: GameServiceMessage.UnderMaintenanceInfo) {
            this.appStore.setUM(underMaintenanceInfo.umInfo);
            this.notificationStore.connection.disconnect();
            this.connectionStore.connection.disconnect();
            StorageManager.remove(localStorageKeys.session);
        }
    }
}
