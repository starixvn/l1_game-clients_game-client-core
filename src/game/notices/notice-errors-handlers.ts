import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { AppHandlers, AppStore } from "../../app";
import { AuthHandlers, AuthStore } from "../../auth";
import { utils } from "../../shared";
import { ConnectionStore } from "../connection/connection-store";
import { GameSetting } from "../game-configs";
import { NoticeStore, NoticeType } from "./notice-store";

const { LocalizedUtils, ErrorUtils } = utils;

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
            protected readonly connectionStore: ConnectionStore
        ) {
            reaction(() => this.authStore.errorCode, this.onErrorCodeChange.bind(this));
        }

        onErrorCodeChange(errorCode: string) {
            if (this.authStore.isDisabledAccount) {
                const text = LocalizedUtils.getLocalizedText("accountClosed", { errorCode });
                this.showNotice(text);
            } else {
                if (ErrorUtils.isSessionTimeoutError(errorCode)) {
                    const key = this.appStore.isApp ? "sessionExpired" : "sessionTimeout";
                    const text = LocalizedUtils.getLocalizedText(key);
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
            this.noticeStore.addNotice({
                message,
                title: LocalizedUtils.getLocalizedText("notice"),
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
            protected readonly backToOperatorLobbyHandler: AppHandlers.BackToOperatorLobby
        ) {
            reaction(
                () => this.connectionStore.isConnectFailed,
                (isConnectFailed) => isConnectFailed && this.showNotice()
            );
        }

        showNotice() {
            const gameName = LocalizedUtils.getLocalizedText(`gameNames.${this.gameSetting.id}`);
            const message = LocalizedUtils.getLocalizedText("lostGameConnection", { gameName });
            const backToLobby = () => {
                this.backToOperatorLobbyHandler.handle();
            };
            this.noticeStore.addNotice({
                message,
                title: LocalizedUtils.getLocalizedText("notice"),
                type: NoticeType.Error,
                onClose: backToLobby,
            });
        }
    }
}
