import { inject, injectable } from "inversify";
import { AppHandlers } from "../../app/app-handlers";
import { AuthStore } from "../../auth";
import { GameServiceMessage, IHandler } from "../../shared";
import { Translator } from "../../shared/utils/localization-manager";
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

    showPopupHandle() {
        this.noticeStore.addNotice({
            message: Translator.commonTranslate("message_disabled_game"),
            title: Translator.commonTranslate("notice"),
            type: NoticeType.Error,
            onClose: this.onClosedHandle,
            showBtnConfirmButton: true,
        });

        this.disabledGameStore.setShowPopup(true);
    }

    inGameHandle() {
        if (this.disabledGameStore.disabled) {
            if (!this.disabledGameStore.showPopup && this.roundTimeStore.isShowDisabledGameMessage) {
                this.showPopupHandle();
                this.roundRunningHandlers.stopRunner();
            }
        } else {
            this.disabledGameStore.setGameStatus(true);
            this.roundTimeStore.resetRoundTime();
        }
    }

    joinGameHandle() {
        this.showPopupHandle();
    }

    handle() {
        this.roundTimeStore.endRound ? this.inGameHandle() : this.joinGameHandle();
    }
}
