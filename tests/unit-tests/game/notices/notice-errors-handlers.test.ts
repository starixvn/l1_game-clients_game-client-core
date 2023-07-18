import { stub } from "jest-auto-stub";
import { AppHandlers, AppStore } from "../../../../src/app";
import { AuthHandlers, AuthStore } from "../../../../src/auth";
import { ConnectionStore } from "../../../../src/game/connection/connection-store";
import { GameSetting } from "../../../../src/game/game-configs/game-setting";
import { NoticeErrorsHandlers } from "../../../../src/game/notices/notice-errors-handlers";
import { NoticeStore, NoticeType } from "../../../../src/game/notices/notice-store";
import { ErrorUtils, LocalizedUtils } from "../../../../src/shared/utils";

jest.mock("../../../../src/shared/utils", () => ({
    LocalizedUtils: { getLocalizedText: jest.fn() },
    ErrorUtils: { isSessionTimeoutError: jest.fn().mockReturnValue(false) },
}));
jest.mock("mobx");

describe("NoticeErrorsHandlers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("AutoSignOut", () => {
        let handler: NoticeErrorsHandlers.AutoSignOutHandler;
        let appStore: AppStore;
        let noticeStore: NoticeStore;
        let authStore: AuthStore;
        let signOutHandler: AuthHandlers.SignOut;
        let connectionStore: ConnectionStore;
        beforeAll(() => {
            appStore = stub<AppStore>();
            noticeStore = stub<NoticeStore>();
            authStore = stub<AuthStore>();
            signOutHandler = stub<AuthHandlers.SignOut>();
            connectionStore = stub<ConnectionStore>();
        });

        beforeEach(() => {
            handler = new NoticeErrorsHandlers.AutoSignOutHandler(appStore, noticeStore, authStore, signOutHandler, connectionStore);
        });

        describe("onErrorCodeChange", () => {
            beforeEach(() => {
                handler.showNotice = jest.fn();
            });
            it("should call handle with account closed when isDisabledAccount true", () => {
                // arrange
                authStore.isDisabledAccount = true;
                (LocalizedUtils.getLocalizedText as jest.Mock).mockReturnValueOnce("accountClosed");

                // act
                handler.onErrorCodeChange("");

                // assert
                expect(handler.showNotice).toHaveBeenCalledWith("accountClosed");
            });

            describe("when error code is session timeout error", () => {
                beforeEach(() => {
                    authStore.isDisabledAccount = false;
                    (ErrorUtils.isSessionTimeoutError as jest.Mock).mockReturnValueOnce(true);
                });
                it("should call handle with sessionExpired message when app", () => {
                    // arrange
                    appStore.isApp = true;
                    (LocalizedUtils.getLocalizedText as jest.Mock).mockReturnValueOnce("session expired");

                    // act
                    handler.onErrorCodeChange("123");

                    // assert
                    expect(LocalizedUtils.getLocalizedText).toHaveBeenCalledWith("sessionExpired");
                    expect(handler.showNotice).toHaveBeenCalledWith(`session expired (123)`);
                });

                it("should call handle with sessionTimeout message when not app", () => {
                    // arrange
                    appStore.isApp = false;
                    (LocalizedUtils.getLocalizedText as jest.Mock).mockReturnValueOnce("session timeout");

                    // act
                    handler.onErrorCodeChange("123");

                    // assert
                    expect(LocalizedUtils.getLocalizedText).toHaveBeenCalledWith("sessionTimeout");
                    expect(handler.showNotice).toHaveBeenCalledWith(`session timeout (123)`);
                });
            });
        });

        describe("handle", () => {
            beforeEach(() => {
                jest.useFakeTimers();
                jest.spyOn(global, "setTimeout");
            });

            afterEach(() => {
                jest.runOnlyPendingTimers();
                jest.useRealTimers();
            });

            it("should call sign out handler after 10s", () => {
                // act
                handler.showNotice();
                jest.advanceTimersByTime(10000);

                // assert
                expect(signOutHandler.handle).toHaveBeenCalled();
                expect(connectionStore.closeSocket).toHaveBeenCalled();
            });

            it("should add expected notice into noticeStore ", () => {
                // arrange
                (LocalizedUtils.getLocalizedText as jest.Mock).mockReturnValueOnce("Notice");

                // act
                handler.showNotice("message");

                // assert
                expect((noticeStore.addNotice as jest.Mock).mock.calls[0][0].message).toBe("message");
                expect((noticeStore.addNotice as jest.Mock).mock.calls[0][0].title).toBe("Notice");
                expect((noticeStore.addNotice as jest.Mock).mock.calls[0][0].type).toBe(NoticeType.Error);
                expect(typeof (noticeStore.addNotice as jest.Mock).mock.calls[0][0].onClose).toBe("function");
            });
        });
    });

    describe("BackToOperatorLobby", () => {
        let handler: NoticeErrorsHandlers.BackToOperatorLobbyHandler;
        let gameSetting: GameSetting;
        let connectionStore: ConnectionStore;
        let noticeStore: NoticeStore;
        let backToOperatorLobbyHandler: AppHandlers.BackToOperatorLobby;
        beforeAll(() => {
            gameSetting = stub<GameSetting>();
            noticeStore = stub<NoticeStore>();
            connectionStore = stub<ConnectionStore>();
            backToOperatorLobbyHandler = stub<AppHandlers.BackToOperatorLobby>();
        });

        beforeEach(() => {
            handler = new NoticeErrorsHandlers.BackToOperatorLobbyHandler(
                gameSetting,
                connectionStore,
                noticeStore,
                backToOperatorLobbyHandler
            );
            (LocalizedUtils.getLocalizedText as jest.Mock)
                .mockReturnValueOnce("Game name")
                .mockReturnValueOnce("lost game connection")
                .mockReturnValueOnce("Notice");
        });

        it("should add notice when connection is lost", () => {
            // act
            handler.showNotice();

            // assert
            expect((noticeStore.addNotice as jest.Mock).mock.calls[0][0].message).toBe("lost game connection");
            expect((noticeStore.addNotice as jest.Mock).mock.calls[0][0].title).toBe("Notice");
            expect((noticeStore.addNotice as jest.Mock).mock.calls[0][0].type).toBe(NoticeType.Error);
            expect(typeof (noticeStore.addNotice as jest.Mock).mock.calls[0][0].onClose).toBe("function");
            expect(LocalizedUtils.getLocalizedText).toHaveBeenCalledWith(`gameNames.${gameSetting.id}`);
            expect(LocalizedUtils.getLocalizedText).toHaveBeenCalledWith("lostGameConnection", { gameName: "Game name" });
            expect(LocalizedUtils.getLocalizedText).toHaveBeenCalledWith("notice");
        });
    });
});
