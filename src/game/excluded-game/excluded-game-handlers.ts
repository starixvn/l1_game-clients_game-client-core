import { inject, injectable } from "inversify";
import { GameServiceMessage, IHandler } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import { LocalizedUtils } from "../../shared/utils/localized-utils";
import { GameSetting } from "../game-configs";
import { AppHandlers } from "../../app/app-handlers";


@injectable()
export class NoPermissionHandlers implements IHandler<void> {
    name = GameServiceMessage.notPermittedToPlay;

    constructor(
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,        
        @inject(GameSetting) protected readonly gameSetting: GameSetting,        
        @inject(AppHandlers.BackToOperatorLobby) protected readonly backToOperatorLobby: AppHandlers.BackToOperatorLobby,
    ) {
    }    

    handle() {
        const goToLobby = () => {
            this.backToOperatorLobby.handle();
        };
        const gameName = LocalizedUtils.getLocalizedText(`gameNames.${this.gameSetting.id}`);            
        this.noticeStore.addNotice({
            message: LocalizedUtils.getLocalizedText("gameExcluded", { gameName }),
            title: LocalizedUtils.getLocalizedText("notice"),
            type: NoticeType.Info,
            onClose: goToLobby,
        });  
    }
}
