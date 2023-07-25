import { inject, injectable } from "inversify";
import { GameServiceMessage, IHandler } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import { Translator } from "../../shared/utils/localization-manager";
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
        const gameName = Translator.gameTranslate('game_name');            
        this.noticeStore.addNotice({
            message: Translator.commonTranslate("game_excluded", { gameName }),
            title: Translator.commonTranslate("notice"),
            type: NoticeType.Info,
            onClose: goToLobby,
        });  
    }
}
