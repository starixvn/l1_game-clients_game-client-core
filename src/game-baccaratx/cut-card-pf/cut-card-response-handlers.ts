import { inject, injectable } from "inversify";
import { NoticeStore } from "../../game/notices/notice-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { Translator } from "./../../shared/utils/localization-manager";
import { FairnessStore } from "./fairness-store";

@injectable()
export class CutCardResponseHandlers implements IMultipleHandlers {
    constructor(
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore
    ) {}

    handleCutCardResponse(cutCardInfo: GameServiceMessage.CutCard) {
        this.fairnessStore.cutCardInfo = cutCardInfo;
        if (!cutCardInfo.successful) {
            this.noticeStore.addWarning(Translator.gameTranslate("submission_failed_time_expired"));
        }
    }

    eventHandleList = [
        {
            name: GameServiceMessage.CutCard.eventName,
            handle: this.handleCutCardResponse,
        },
    ];
}
