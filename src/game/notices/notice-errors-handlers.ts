import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { AppHandlers, AppStore } from "../../app";
import { AuthHandlers, AuthStore } from "../../auth";
import { utils } from "../../shared";
import { Translator } from "../../shared/utils/localization-manager";
import { ConnectionStore } from "../connection/connection-store";
import { GameSetting } from "../game-configs";
import { AppTypes } from "./../../shared/constants/app-type";
import { NoticeStore, NoticeType } from "./notice-store";
const { ErrorUtils } = utils;

export namespace NoticeErrorsHandlers {
    @injectable()
    export class AutoSignOutHandler {
        constructor(
            @inject(AppStore)
            protected readonly appStore: AppStore,
            @inject(NoticeStore)
            protected readonly noticeStore: NoticeStore,
            @inject(AuthStore)
            protected readonly authStore: AuthStore,
            @inject(AuthHandlers.SignOut)
            protected readonly signOutHandler: AuthHandlers.SignOut,
            @inject(ConnectionStore)
            protected readonly connectionStore: ConnectionStore,
            @inject(AuthHandlers.ClearRecheckInInterval)
            protected readonly clearRecheckInInterval: AuthHandlers.ClearRecheckInInterval
        ) {
            reaction(() => this.authStore.errorCode, this.onErrorCodeChange.bind(this));
        }

        onErrorCodeChange(errorCode: string) {
            if (this.authStore.isDisabledAccount) {
                const text = Translator.commonTranslate("message_close_account", { errorCode });
                this.showNotice(text);
            } else {
                if (ErrorUtils.isSessionTimeoutError(errorCode)) {
                    const key = this.appStore.isApp ? "message_session_expired" : "message_session_timeout";
                    const text = Translator.commonTranslate(key);
                    this.showNotice(`${text} (${errorCode})`);
                }
            }
        }

        showNotice(message = "") {
            const signOut = () => {
                this.signOutHandler.handle();
                this.connectionStore.closeSocket();
            };
            setTimeout(signOut, 10000);
            this.clearRecheckInInterval.handle();
            this.noticeStore.addNotice({
                message,
                title: Translator.commonTranslate("notice"),
                type: NoticeType.Error,
                onClose: signOut,
                showBtnConfirmButton: true,
            });
        }
    }

    @injectable()
    export class BackToOperatorLobbyHandler {
        constructor(
            @inject(GameSetting)
            protected readonly gameSetting: GameSetting,
            @inject(ConnectionStore)
            protected readonly connectionStore: ConnectionStore,
            @inject(NoticeStore)
            protected readonly noticeStore: NoticeStore,
            @inject(AppHandlers.BackToOperatorLobby)
            protected readonly backToOperatorLobbyHandler: AppHandlers.BackToOperatorLobby,
            @inject(AuthStore)
            protected readonly authStore: AuthStore
        ) {
            reaction(
                () => this.connectionStore.isConnectFailed,
                (isConnectFailed) => isConnectFailed && !this.isInstantApp() && this.showNotice()
            );
        }

        isInstantApp() {
            return this.authStore.system === AppTypes.Instant;
        }

        showNotice() {
            const gameName = Translator.gameTranslate("game_name");
            const message = Translator.commonTranslate("message_lost_game_connection", { gameName });
            const backToLobby = () => {
                this.backToOperatorLobbyHandler.handle();
            };
            this.noticeStore.addNotice({
                message,
                title: Translator.commonTranslate("notice"),
                type: NoticeType.Error,
                onClose: backToLobby,
            });
        }
    }
}
