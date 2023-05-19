import { stub } from "jest-auto-stub";
import { AppStore } from "../../../../src/app";
import { AuthHandlers } from "../../../../src/auth";
import { ErrorHandlers } from "../../../../src/game/errors";
import { NoticeStore, NoticeType } from "../../../../src/game/notices";
import { RoundStore } from "../../../../src/game/rounds/round-store";
import { PlayerStore } from "../../../../src/players";
import { GameServiceMessage } from "../../../../src/shared";

import { LocalizedUtils } from "../../../../src/shared/utils/localized-utils";

describe("ErrorHandlers test", () => {
    let instance: ErrorHandlers;
    let roundStore: RoundStore;
    let noticeStore: NoticeStore;
    let playerStore: PlayerStore;
    let appStore: AppStore;
    let signOutHandler: AuthHandlers.SignOut;
    beforeAll(() => {
        roundStore = stub<RoundStore>();
        noticeStore = stub<NoticeStore>();
        playerStore = stub<PlayerStore>();
        appStore = stub<AppStore>();
        signOutHandler = stub<AuthHandlers.SignOut>();
    });

    beforeEach(() => {
        instance = new ErrorHandlers(roundStore, playerStore, appStore, noticeStore, signOutHandler);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleApiError", () => {
        it("shows message for expired token, when error code is session timeout type.", () => {
            // Arrange
            const data = stub<GameServiceMessage.ApiError>();
            const showMessageSpy = jest.spyOn(instance, "showMessageForExpiredToken");
            instance.isSessionTimeoutError = jest.fn().mockReturnValue(true);

            // Act
            instance.handleApiError(data);

            // Assert
            expect(showMessageSpy).toBeCalled();
        });

        it("shows notice error, when error code is NOT session timeout type.", () => {
            // Arrange
            const data = stub<GameServiceMessage.ApiError>({
                hedgeBetGroup: [],
                errorCode: "1001",
            });
            instance.isSessionTimeoutError = jest.fn().mockReturnValue(false);
            delete data.minBet;
            delete data.maxBet;

            // Act
            instance.handleApiError(data);

            // Assert
            expect(noticeStore.addNotice).toBeCalled();
        });

        it("shows notice error and update stake level, when error code is NOT session timeout type.", () => {
            // Arrange
            const data = stub<GameServiceMessage.ApiError>({
                hedgeBetGroup: [],
                errorCode: "1001",
            });
            instance.isSessionTimeoutError = jest.fn().mockReturnValue(false);
            const minBet = 1;
            const maxBet = 10;
            data.minBet = minBet;
            data.maxBet = maxBet;

            // Act
            instance.handleApiError(data);

            // Assert
            expect(noticeStore.addNotice).toBeCalled();
            expect(playerStore.stakeLevel.minBet).toEqual(minBet);
            expect(playerStore.stakeLevel.maxBet).toEqual(maxBet);
        });
    });

    describe("isSessionTimeoutError", () => {
        it("should return true if error code is one of the expected token error codes", () => {
            // Arrange
            const errorCode = "1002";

            // Act
            const result = instance.isSessionTimeoutError(errorCode);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false if error code is not one of the expected token error codes", () => {
            // Arrange
            const errorCode = "9999";

            // Act
            const result = instance.isSessionTimeoutError(errorCode);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("showMessageForExpiredToken", () => {
        beforeEach(() => {
            appStore.isApp = true;
            noticeStore.addNotice = jest.fn();
            signOutHandler.handle = jest.fn();
            LocalizedUtils.getLocalizedText = (key, option) => key;
            jest.useFakeTimers();
            jest.spyOn(global, "setTimeout");
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        it("should call addNotice with messages.sessionExpired", () => {
            // Arrange
            const errorCode = "1001";
            const text = appStore.isApp ? "messages.sessionExpired" : "messages.sessionTimeout";
            const message = `${text} (${errorCode})`;

            // Act
            instance.showMessageForExpiredToken(errorCode);

            // Assert
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
            expect(noticeStore.addNotice).toHaveBeenCalledWith({
                message: message,
                title: "Notice",
                type: NoticeType.Error,
                onClose: expect.any(Function),
            });
        });

        it("should call addNotice with messages.sessionTimeout", () => {
            // Arrange
            appStore.isApp = false;
            const errorCode = "1001";
            const text = appStore.isApp ? "messages.sessionExpired" : "messages.sessionTimeout";
            const message = `${text} (${errorCode})`;

            // Act
            instance.showMessageForExpiredToken(errorCode);

            // Assert
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
            expect(noticeStore.addNotice).toHaveBeenCalledWith({
                message: message,
                title: "Notice",
                type: NoticeType.Error,
                onClose: expect.any(Function),
            });
        });
    });
});
