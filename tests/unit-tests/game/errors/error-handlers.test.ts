import { stub } from "jest-auto-stub";
import { AppStore } from "../../../../src/app";
import { AuthHandlers } from "../../../../src/auth";
import { ErrorHandlers } from "../../../../src/game/errors";
import { NoticeStore } from "../../../../src/game/notices";
import { RoundStore } from "../../../../src/game/rounds/round-store";
import { PlayerStore } from "../../../../src/players";
import { GameServiceMessage } from "../../../../src/shared";

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
});
