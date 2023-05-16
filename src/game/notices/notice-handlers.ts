import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { RoundStore } from "../rounds/round-store";
import { NoticeStore } from "./notice-store";
import { NoticeUtils } from "./notice-utils";

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

        const text = NoticeUtils.getErrorMessage(notice);
        this.noticeStore.addWarning(text);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Notice.eventName,
            handle: this.handleNotice,
        },
    ];
}
