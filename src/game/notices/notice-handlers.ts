import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers, utils } from "../../shared";
import { RoundStore } from "../rounds";
import { NoticeStore } from "./notice-store";

const { ErrorUtils } = utils;

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

        const text = ErrorUtils.getErrorMessage(notice);
        this.noticeStore.addWarning(text);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Notice.eventName,
            handle: this.handleNotice,
        },
    ];
}
