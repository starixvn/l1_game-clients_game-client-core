import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers, utils } from "../../shared";
import { NoticeStore } from "../notices/notice-store";
import { RoundStore } from "../rounds/round-store";
import { parseErrorCode } from "./notice-utils";

const { FormatUtils } = utils;

@injectable()
export class NoticeHandlers implements IMultipleHandlers {
    constructor(
        @inject(RoundStore)
        protected readonly roundStore: RoundStore,
        @inject(NoticeStore)
        protected readonly noticeStore: NoticeStore
    ) {}

    handleNotice(notice: GameServiceMessage.Notice) {
        const { errorCode, hedgeBetGroup, gameRoundId } = notice;
        if (gameRoundId && gameRoundId !== this.roundStore.roundId) {
            return;
        }

        //Fake methods to implement later
        const getBetChoiceString = (choice: string) => choice;
        const getGameNameString = (gameName: number) => gameName.toString();
        const getLocalizedText = (key: string, option: any) => key;
        //end fake methods

        const option = {};
        hedgeBetGroup?.forEach((choice, index) => {
            option[`betChoice${index + 1}`] = getBetChoiceString(choice);
        });

        if (!!notice.gameTypeId) {
            Object.assign(option, { gameName: getGameNameString(notice.gameTypeId) });
        }

        if (!!notice.minBet) {
            Object.assign(option, { minBet: FormatUtils.numberWithCommas(notice.minBet) });
        }

        if (!!notice.maxBet) {
            Object.assign(option, { maxBet: FormatUtils.numberWithCommas(notice.maxBet) });
        }

        const key = parseErrorCode(errorCode);
        const text = getLocalizedText(key, option);
        this.noticeStore.addWarning(text);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Notice.eventName,
            handle: this.handleNotice,
        },
    ];
}
