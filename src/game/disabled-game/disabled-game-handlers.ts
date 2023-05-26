import { inject, injectable } from "inversify";
import { GameServiceMessage, IHandler } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import { StorageManager, localStorageKeys } from "../../shared/utils/storage-manager";
import { ISessionInfo } from "../../auth";
import { LocalizedUtils } from "../../shared/utils/localized-utils";
import { AppHandlers } from "../../app/app-handlers";
import { DisabledGameStore } from "./disabled-game-store";

@injectable()
export class DisableGameHandlers implements IHandler<GameServiceMessage.DisabledGameInfo> {
    name = GameServiceMessage.DisabledGameInfo.eventName;
    constructor(
        @inject(DisabledGameStore) protected readonly disabledGameStore: DisabledGameStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(AppHandlers.BackToOperatorLobby) protected readonly backToOperatorLobby: AppHandlers.BackToOperatorLobby
    ) {}

    handle(disabledGameInfo: GameServiceMessage.DisabledGameInfo) {
        if (this.disabledGameStore.disabled) {
            return;
        }

        this.disabledGameStore.setGameStatus(true);
        const lang = (StorageManager.get(localStorageKeys.session) as ISessionInfo).language;
        const message = disabledGameInfo[lang] ?? "Under maintenance, please back later after 10 seconds";
        this.noticeStore.addNotice({
            message,
            title: LocalizedUtils.getLocalizedText("Notice"),
            type: NoticeType.Error,
            onClose: () => {}, //TO DO : this.backToOperatorLobby.handle,
        });
    }
}
