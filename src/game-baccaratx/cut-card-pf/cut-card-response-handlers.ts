import { inject, injectable } from "inversify";
import { NoticeStore } from "../../game/notices/notice-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { Translator } from "./../../shared/utils/localization-manager";
import { FairnessStore } from "./fairness-store";
import { GameSetting } from "../../game/game-configs";

@injectable()
export class CutCardResponseHandlers implements IMultipleHandlers {
    constructor(
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(GameSetting) private readonly gameSetting: GameSetting
    ) {}

    handleCutCardResponse(cutCardInfo: GameServiceMessage.CutCard) {
        this.fairnessStore.cutCardInfo = cutCardInfo;
        if (!cutCardInfo.successful) {
            this.noticeStore.addWarning(Translator.translate(`${this.gameSetting.name}.submission_failed_time_expired`));
        }
    }

    eventHandleList = [
        {
            name: GameServiceMessage.CutCard.eventName,
            handle: this.handleCutCardResponse,
        },
    ];
}
