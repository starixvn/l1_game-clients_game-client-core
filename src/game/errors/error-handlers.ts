import { inject, injectable } from "inversify";
import { AuthStore } from "../../auth";
import { MainPlayerStore } from "../../players";
import { GameServiceMessage, IMultipleHandlers, utils } from "../../shared";
import { Translator } from "../../shared/utils/localization-manager";
import { NoticeInfo, NoticeStore, NoticeType } from "../notices";
import { AppTypes } from "./../../shared/constants/app-type";
import { ErrorStore } from "./error-store";
import { GameSetting } from "../game-configs";

const { ErrorUtils } = utils;

@injectable()
export class ErrorHandlers implements IMultipleHandlers {
    constructor(
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(AuthStore) protected readonly authStore: AuthStore,
        @inject(ErrorStore) protected readonly errorStore: ErrorStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting
    ) {}

    getSystem = () => {
        return this.authStore?.system || AppTypes.Club;
    };

    handleApiError(apiError: GameServiceMessage.ApiError) {
        this.errorStore.apiError = apiError;
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

        const text = ErrorUtils.getErrorMessage(apiError, this.getSystem(), this.gameSetting.name);
        this.noticeStore.addNotice({
            message: text,
            title: Translator.commonTranslate("notice"),
            type: NoticeType.Error,
            onClose: null,
            noticeInfo: NoticeInfo.ApiError,
        });
    }

    eventHandleList = [
        {
            name: GameServiceMessage.ApiError.eventName,
            handle: this.handleApiError,
        },
    ];
}
