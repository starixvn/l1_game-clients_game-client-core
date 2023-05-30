import { inject, injectable } from "inversify";
import { IHandler, NotificationServiceMessage } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import { AuthStore } from "../../auth";
import { LocalizedUtils } from "../../shared/utils/localized-utils";
import { AppHandlers } from "../../app/app-handlers";
import { DisabledGameStore } from "./disabled-game-store";
import { RoundTimeStore } from "../rounds/round-time-store";
import { ConnectionStore } from "../connection/connection-store";

export const defaultDisabledMessage = "Under maintenance, please back later after 10 seconds";
@injectable()
export class DisableGameHandlers implements IHandler<NotificationServiceMessage.DisabledGameInfo> {
    name = NotificationServiceMessage.DisabledGameInfo.eventName;

    constructor(
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(AuthStore) protected readonly authStore: AuthStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(DisabledGameStore) protected readonly disabledGameStore: DisabledGameStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(AppHandlers.BackToOperatorLobby) protected readonly backToOperatorLobby: AppHandlers.BackToOperatorLobby
    ) {
        this.onClosedHandle = this.onClosedHandle.bind(this);
    }

    onClosedHandle() {
        this.connectionStore.connection.disconnect();
        this.backToOperatorLobby.handle();
    }

    handle(disabledGameInfo: NotificationServiceMessage.DisabledGameInfo) {
        if (!this.disabledGameStore.disabled && this.roundTimeStore.isShowDisabledGameMessage) {
            this.disabledGameStore.setGameStatus(true);
            this.noticeStore.addNotice({
                message: disabledGameInfo[this.authStore.language] ?? defaultDisabledMessage,
                title: LocalizedUtils.getLocalizedText("Notice"),
                type: NoticeType.Error,
                onClose: this.onClosedHandle,
            });
        }
    }
}
