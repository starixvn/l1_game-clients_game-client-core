import { inject, injectable } from "inversify";
import { AuthStore } from "../../auth";
import { MainPlayerStore } from "../../players";
import { GameServiceMessage, IMultipleHandlers, utils } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import {Translator} from '../../shared/utils/localization-manager';

const { ErrorUtils } = utils;

@injectable()
export class ErrorHandlers implements IMultipleHandlers {
    constructor(
        @inject(MainPlayerStore)
        protected readonly mainPlayerStore: MainPlayerStore,
        @inject(NoticeStore)
        protected readonly noticeStore: NoticeStore,
        @inject(AuthStore)
        protected readonly authStore: AuthStore
    ) {}

    handleApiError(apiError: GameServiceMessage.ApiError) {
        const { minBet, maxBet, errorCode } = apiError;

        const errorCodeString = errorCode.toString();
        if (ErrorUtils.isSessionTimeoutError(errorCodeString)) {
            this.authStore.errorCode = errorCodeString;
            return;
        }

        if (!!minBet) {
            this.mainPlayerStore.stakeLevel.minBet = minBet;
        }

        if (!!maxBet) {
            this.mainPlayerStore.stakeLevel.maxBet = maxBet;
        }

        const text = ErrorUtils.getErrorMessage(apiError);
        this.noticeStore.addNotice({
            message: text,
            title: Translator.commonTranslate("notice"),
            type: NoticeType.Error,
            onClose: () => {},
        });
    }

    eventHandleList = [
        {
            name: GameServiceMessage.ApiError.eventName,
            handle: this.handleApiError,
        },
    ];
}
