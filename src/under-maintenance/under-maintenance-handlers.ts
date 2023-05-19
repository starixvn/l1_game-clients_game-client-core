import { inject, injectable } from "inversify";
import { StorageManager, localStorageKeys } from "../shared/utils";
import { GameServiceMessage, IHandler } from "../shared";
import { AppStore } from "../app";
import { ConnectionStore } from "../game/connection";
import { NotificationStore } from "../notification";
import { SiteConfigs } from "../configs";

@injectable()
export class UnderMaintenanceHandler implements IHandler<GameServiceMessage.UnderMaintenanceInfo> {
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
