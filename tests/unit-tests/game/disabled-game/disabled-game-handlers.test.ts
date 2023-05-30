import { AppStore } from "../../../../src/app/app-store";
import { Mediator, NotificationServiceMessage } from "../../../../src/shared";
import { DisableGameHandlers, DisabledGameStore, defaultDisabledMessage } from "../../../../src/game/disabled-game";
import { NoticeStore, NoticeType } from "../../../../src/game/notices";
import { AppHandlers } from "../../../../src/app";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { gameSettings } from "../../container.test";
import { AuthStore } from "../../../../src/auth/auth-store";
import { ConnectionStore } from "../../../../src/game/connection";
import { io } from "socket.io-client";

jest.mock("mobx");

jest.mock("socket.io-client", () => ({
    io: jest.fn().mockReturnValue({ on: jest.fn() }),
}));

jest.mock("../../../../src/shared/utils/localized-utils", () => {
    return {
        LocalizedUtils: {
            getLocalizedText: jest.fn().mockImplementation((key, option) => key),
        },
    };
});

describe("DisableGameHandlers tests", () => {
    const fakeDisabledGameInfo: NotificationServiceMessage.DisabledGameInfo = {
        "vi-VN": "",
        "en-US": "Fake disabled game message",
        "zh-CN": "",
        "zh-TW": "",
        "th-TH": "",
        "id-ID": "",
    };

    let connectionStore: ConnectionStore,
        authStore: AuthStore,
        disabledGameStore: DisabledGameStore,
        noticeStore: NoticeStore,
        roundTimeStore: RoundTimeStore,
        backToOperatorLobby: AppHandlers.BackToOperatorLobby,
        handler: DisableGameHandlers;

    beforeAll(() => {
        // arrange
        connectionStore = new ConnectionStore(new Mediator(), gameSettings);
        authStore = new AuthStore();
        disabledGameStore = new DisabledGameStore();
        disabledGameStore.setGameStatus = jest.fn();

        noticeStore = new NoticeStore();
        noticeStore.addNotice = jest.fn();

        roundTimeStore = new RoundTimeStore(gameSettings);
        backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore());
    });

    describe("onClosedHandle", () => {
        describe("when already disable game", () => {
            it("should disconnect socket and back to lobby", () => {
                // arrange
                connectionStore.connection = io("", {});
                connectionStore.connection.disconnect = jest.fn();

                backToOperatorLobby.handle = jest.fn();
                handler = new DisableGameHandlers(
                    connectionStore,
                    authStore,
                    roundTimeStore,
                    disabledGameStore,
                    noticeStore,
                    backToOperatorLobby
                );

                // act
                handler.onClosedHandle();

                // assert
                expect(connectionStore.connection.disconnect).toBeCalledTimes(1);
                expect(backToOperatorLobby.handle).toBeCalledTimes(1);
            });
        });
    });

    describe("handle", () => {
        describe("when already disable game", () => {
            it("should not call stores", () => {
                // arrange
                disabledGameStore.disabled = true;
                handler = new DisableGameHandlers(
                    connectionStore,
                    authStore,
                    roundTimeStore,
                    disabledGameStore,
                    noticeStore,
                    backToOperatorLobby
                );

                // act
                handler.handle(fakeDisabledGameInfo);

                // assert
                expect(disabledGameStore.setGameStatus).not.toHaveBeenCalled();
                expect(noticeStore.addNotice).not.toHaveBeenCalled();
            });
        });

        describe("when ticket is still running in current round", () => {
            it("should not call stores", () => {
                // arrange
                disabledGameStore.disabled = true;
                roundTimeStore.placingBet = 36;
                roundTimeStore.roundTime = 39;

                handler = new DisableGameHandlers(
                    connectionStore,
                    authStore,
                    roundTimeStore,
                    disabledGameStore,
                    noticeStore,
                    backToOperatorLobby
                );

                // act
                handler.handle(fakeDisabledGameInfo);

                // assert
                expect(disabledGameStore.setGameStatus).not.toHaveBeenCalled();
                expect(noticeStore.addNotice).not.toHaveBeenCalled();
            });
        });

        describe("when game runs to next round", () => {
            const authStoreLangs = [
                ["en-US", fakeDisabledGameInfo["en-US"]],
                ["abc", defaultDisabledMessage],
            ];
            test.each(authStoreLangs)("should set disable game true and open popup.", (authStoreLang, expectedDisabledMessages) => {
                // arrange
                disabledGameStore.disabled = false;
                roundTimeStore.placingBet = 36;
                roundTimeStore.roundTime = 33;
                authStore.language = authStoreLang;
                handler = new DisableGameHandlers(
                    connectionStore,
                    authStore,
                    roundTimeStore,
                    disabledGameStore,
                    noticeStore,
                    backToOperatorLobby
                );

                // act
                handler.handle(fakeDisabledGameInfo);

                // assert
                expect(disabledGameStore.setGameStatus).toBeCalledWith(true);
                expect(noticeStore.addNotice).toHaveBeenCalledWith({
                    message: expectedDisabledMessages,
                    title: "Notice",
                    type: NoticeType.Error,
                    onClose: expect.any(Function),
                });
            });
        });
    });
});
