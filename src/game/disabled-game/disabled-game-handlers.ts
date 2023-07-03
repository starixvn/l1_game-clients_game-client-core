import { inject, injectable } from "inversify";
import { AppHandlers } from "../../app/app-handlers";
import { AuthStore } from "../../auth";
import { GameServiceMessage, IHandler } from "../../shared";
import { LocalizedUtils } from "../../shared/utils/localized-utils";
import { ConnectionStore } from "../connection/connection-store";
import { NoticeStore, NoticeType } from "../notices";
import { RoundRunningHandlers } from "../rounds";
import { RoundTimeStore } from "../rounds/round-time-store";
import { DisabledGameStore } from "./disabled-game-store";

@injectable()
export class DisableGameHandlers implements IHandler<GameServiceMessage.DisabledGameInfo> {
    name = GameServiceMessage.DisabledGameInfo.eventName;

    constructor(
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(AuthStore) protected readonly authStore: AuthStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(DisabledGameStore) protected readonly disabledGameStore: DisabledGameStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(AppHandlers.BackToOperatorLobby) protected readonly backToOperatorLobby: AppHandlers.BackToOperatorLobby,
        @inject(RoundRunningHandlers) protected readonly roundRunningHandlers: RoundRunningHandlers
    ) {
        this.onClosedHandle = this.onClosedHandle.bind(this);
    }

    onClosedHandle() {
        this.connectionStore.onDisconnected();
        this.backToOperatorLobby.handle();
    }

    showPopupHandle(disabledGameInfo: GameServiceMessage.DisabledGameInfo) {
        this.noticeStore.addNotice({
            message: disabledGameInfo[this.authStore.language],
            title: LocalizedUtils.getLocalizedText("notice"),
            type: NoticeType.Error,
            onClose: this.onClosedHandle,
            showBtnConfirmButton: true,
        });

        this.disabledGameStore.setShowPopup(true);
    }

    inGameHandle(disabledGameInfo: GameServiceMessage.DisabledGameInfo) {
        if (this.disabledGameStore.disabled) {
            if (!this.disabledGameStore.showPopup && this.roundTimeStore.isShowDisabledGameMessage) {
                this.showPopupHandle(disabledGameInfo);
                this.roundRunningHandlers.stopRunner();
            }
        } else {
            this.disabledGameStore.setGameStatus(true);
            this.roundTimeStore.resetRoundTime();
        }
    }

    joinGameHandle(disabledGameInfo: GameServiceMessage.DisabledGameInfo) {
        this.showPopupHandle(disabledGameInfo);
    }

    handle(disabledGameInfo: GameServiceMessage.DisabledGameInfo) {
        this.roundTimeStore.endRound ? this.inGameHandle(disabledGameInfo) : this.joinGameHandle(disabledGameInfo);
    }
}
