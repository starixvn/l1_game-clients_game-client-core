import { stub } from "jest-auto-stub";
import { AuthStore } from "../../../../src/auth";
import { ErrorHandlers } from "../../../../src/game/errors";
import { NoticeStore } from "../../../../src/game/notices";
import { MainPlayerStore } from "../../../../src/players";
import { GameServiceMessage } from "../../../../src/shared";
import { ErrorUtils } from "../../../../src/shared/utils/error-utils";

jest.mock("../../../../src/shared/l10n", () => ({
    l10n: {
        t: jest.fn(),
    },
}));

jest.mock("../../../../src/shared/utils/error-utils", () => ({
    ErrorUtils: { isSessionTimeoutError: jest.fn(), getErrorMessage: jest.fn() },
}));

describe("ErrorHandlers test", () => {
    let instance: ErrorHandlers;
    let noticeStore: NoticeStore;
    let mainPlayerStore: MainPlayerStore;
    let authStore: AuthStore;
    beforeAll(() => {
        noticeStore = stub<NoticeStore>();
        mainPlayerStore = stub<MainPlayerStore>();
        authStore = stub<AuthStore>();
    });

    beforeEach(() => {
        instance = new ErrorHandlers(mainPlayerStore, noticeStore, authStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleApiError", () => {
        it("set error code in auth store, when error code is session timeout type.", () => {
            // Arrange
            const data = stub<GameServiceMessage.ApiError>({
                errorCode: `1001`,
            });
            (ErrorUtils.isSessionTimeoutError as jest.Mock).mockReturnValue(true);

            // Act
            instance.handleApiError(data);

            // Assert
            expect(authStore.errorCode).toBe(data.errorCode);
        });

        it("shows notice error, when error code is NOT session timeout type.", () => {
            // Arrange
            const data = stub<GameServiceMessage.ApiError>({
                hedgeBetGroup: [],
                errorCode: "1001",
            });
            (ErrorUtils.isSessionTimeoutError as jest.Mock).mockReturnValue(false);
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
            (ErrorUtils.isSessionTimeoutError as jest.Mock).mockReturnValue(false);
            const minBet = 1;
            const maxBet = 10;
            data.minBet = minBet;
            data.maxBet = maxBet;

            // Act
            instance.handleApiError(data);

            // Assert
            expect(noticeStore.addNotice).toBeCalled();
            expect(mainPlayerStore.stakeLevel.minBet).toEqual(minBet);
            expect(mainPlayerStore.stakeLevel.maxBet).toEqual(maxBet);
        });
    });
});
