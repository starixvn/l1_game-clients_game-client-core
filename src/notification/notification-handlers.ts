import { inject, injectable } from "inversify";
import { SiteConfigs } from "../configs";
import { UrlUtils } from "../shared/utils";
import { AppStore } from "../app";
import { GameServiceMessage } from "../shared";
import { Socket, io } from "socket.io-client/dist/socket.io.js";
import { ISessionInfo } from "../auth";
import { StorageManager, localStorageKeys } from "../shared/utils/storage-manager";
import { ConnectionStore } from "../game/connection";
import { SocketEvents } from "../constants/socket-event";

const events = {
    ...SocketEvents,
    ...{
        kickedOut: "kickedOut",
    },
};

@injectable()
export class NotificationHandlers {
    connection: Socket = null;
    constructor(
        @inject(AppStore) protected readonly appStore: AppStore,
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs
    ) {}

    handle() {
        const { isDev, enableMsgpackParserAllGames } = this.siteConfigs;
        const socketUri = isDev ? this.siteConfigs.notificationServiceUrlDev : UrlUtils.buildUrl("http", "/", this.siteConfigs);

        const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
        const options = {
            path: isDev ? "/socket.io" : "/notification/socket.io",
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

        this.connection = io(options.socketUri, options);
        this.connection.on(events.kickedOut, this.handleDataKickedOut.bind(this));
    }

    handleDataKickedOut(underMaintenanceInfo: GameServiceMessage.UnderMaintenanceInfo) {
        this.appStore.setUM(underMaintenanceInfo.umInfo);
        this.connection.disconnect();
        this.connectionStore.connection.disconnect();
    }
}
