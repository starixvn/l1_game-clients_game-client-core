import { inject, injectable } from "inversify";
import { AuthStore } from "../../auth";
import { MainPlayerStore } from "../../players";
import { GameServiceMessage, IMultipleHandlers, utils } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";

const { LocalizedUtils, ErrorUtils } = utils;

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

        if (ErrorUtils.isSessionTimeoutError(`${errorCode}`)) {
            this.authStore.errorCode = errorCode;
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
            title: LocalizedUtils.getLocalizedText("Notice"),
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
