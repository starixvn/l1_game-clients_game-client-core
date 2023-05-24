import { inject, injectable } from "inversify";
import { GameServiceMessage, IHandler } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import { StorageManager, localStorageKeys } from "../../shared/utils/storage-manager";
import { ISessionInfo } from "../../auth";
import { LocalizedUtils } from "../../shared/utils/localized-utils";
import { AppHandlers } from "../../app/app-handlers";

@injectable()
export class DisableGameHandlers implements IHandler<GameServiceMessage.DisableGame> {
    name = GameServiceMessage.DisableGame.eventName;
    constructor(
        @inject(NoticeStore) protected readonly store: NoticeStore,
        @inject(AppHandlers.BackToOperatorLobby) protected readonly backToOperatorLobby: AppHandlers.BackToOperatorLobby
    ) {}

    handle(disabledGameInfo: GameServiceMessage.DisableGame) {
        const lang = (StorageManager.get(localStorageKeys.session) as ISessionInfo).language;
        const message = disabledGameInfo?.um_message[lang] || "Under maintenance, please back later after 10 seconds";
        this.store.addNotice({
            message,
            title: LocalizedUtils.getLocalizedText("Notice"),
            type: NoticeType.Error,
            onClose: this.backToOperatorLobby.handle,
        });
    }
}
