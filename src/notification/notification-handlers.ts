import { inject, injectable } from "inversify";
import { SiteConfigs } from "../configs";
import { UrlUtils } from "../shared/utils";
import { AppStore } from "../app";
import { GameServiceMessage } from "../shared";
import { Socket, io } from "socket.io-client/dist/socket.io.js";
import { ISessionInfo } from "../auth";
import { StorageManager, localStorageKeys } from "../shared/utils/storage-manager";
import { SocketManagerStore } from "./socket-manager-store";

@injectable()
export class NotificationHandlers {
    connection: Socket = null;
    constructor(
        @inject(AppStore) protected readonly appStore: AppStore,
        @inject(SocketManagerStore) protected readonly socketManagerStore: SocketManagerStore,
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
        this.connection.on(GameServiceMessage.UnderMaintenanceInfo.eventName, this.handleDataKickedOut.bind(this));

        this.connection.on("connect", () => {
            this.socketManagerStore.addSocket(this.connection);
        });

        this.connection.on("disconnect", () => {});
    }

    handleDataKickedOut(underMaintenanceInfo: GameServiceMessage.UnderMaintenanceInfo) {
        this.appStore.setUM(underMaintenanceInfo.umInfo);
        this.socketManagerStore.clearSockets();
    }
}
