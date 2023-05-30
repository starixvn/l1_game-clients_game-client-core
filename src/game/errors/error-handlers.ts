import { inject, injectable } from "inversify";
import { AppStore } from "../../app";
import { AuthHandlers } from "../../auth";
import { PlayerStore } from "../../players";
import { GameServiceMessage, IMultipleHandlers, utils } from "../../shared";
import { NoticeStore, NoticeType } from "../notices";
import { RoundStore } from "../rounds";

const { LocalizedUtils, ErrorUtils } = utils;

@injectable()
export class ErrorHandlers implements IMultipleHandlers {
    constructor(
        @inject(RoundStore)
        protected readonly roundStore: RoundStore,
        @inject(PlayerStore)
        protected readonly playerStore: PlayerStore,
        @inject(AppStore)
        protected readonly appStore: AppStore,
        @inject(NoticeStore)
        protected readonly noticeStore: NoticeStore,
        @inject(AuthHandlers.SignOut)
        protected readonly signOutHandler: AuthHandlers.SignOut
    ) {}

    showMessageForExpiredToken(errorCode: string) {
        const key = this.appStore.isApp ? "sessionExpired" : "sessionTimeout";
        const text = LocalizedUtils.getLocalizedText(key);
        const message = `${text} (${errorCode})`;

        const signOut = () => {
            this.signOutHandler.handle();
        };
        setTimeout(signOut, 10000);
        this.noticeStore.addNotice({
            message,
            title: LocalizedUtils.getLocalizedText("Notice"),
            type: NoticeType.Error,
            onClose: signOut,
        });
    }

    isSessionTimeoutError(errorCode: string): boolean {
        const expectedTokenErrorCodes = ["1001", "1002", "SB0002", "SB0011"];
        return expectedTokenErrorCodes.includes(errorCode);
    }

    handleApiError(apiError: GameServiceMessage.ApiError) {
        const { minBet, maxBet, errorCode } = apiError;

        if (this.isSessionTimeoutError(`${errorCode}`)) {
            this.showMessageForExpiredToken(errorCode);
            return;
        }

        if (!!minBet) {
            this.playerStore.stakeLevel.minBet = minBet;
        }

        if (!!maxBet) {
            this.playerStore.stakeLevel.maxBet = maxBet;
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
