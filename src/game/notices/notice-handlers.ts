import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { NoticeStore, NoticeUtils } from "../notices";
import { RoundStore } from "../rounds/round-store";
const { getErrorMessage } = NoticeUtils;

@injectable()
export class NoticeHandlers implements IMultipleHandlers {
    constructor(
        @inject(RoundStore)
        protected readonly roundStore: RoundStore,
        @inject(NoticeStore)
        protected readonly noticeStore: NoticeStore
    ) {}

    handleNotice(notice: GameServiceMessage.Notice) {
        const { gameRoundId } = notice;
        if (gameRoundId && gameRoundId !== this.roundStore.roundId) {
            return;
        }

        const text = getErrorMessage(notice);
        this.noticeStore.addWarning(text);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Notice.eventName,
            handle: this.handleNotice,
        },
    ];
}
