import { stub } from "jest-auto-stub";
import { AppHandlers } from "../../../../src/app";
import { AppStore } from "../../../../src/app/app-store";
import { AuthStore } from "../../../../src/auth/auth-store";
import { ConnectionStore } from "../../../../src/game/connection";
import { DisableGameHandlers, DisabledGameStore, defaultDisabledMessage } from "../../../../src/game/disabled-game";
import { NoticeStore, NoticeType } from "../../../../src/game/notices";
import { RoundRunningHandlers } from "../../../../src/game/rounds";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { GameServiceMessage } from "../../../../src/shared";
import { gameSettings } from "../../container.test";

jest.mock("../../../../src/shared/utils/localized-utils", () => {
    return {
        LocalizedUtils: {
            getLocalizedText: jest.fn().mockImplementation((key, option) => key),
        },
    };
});

describe("DisableGameHandlers tests", () => {
    const fakeDisabledGameInfo: GameServiceMessage.DisabledGameInfo = {
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
        handler: DisableGameHandlers,
        roundRunningHandlers: RoundRunningHandlers;

    beforeAll(() => {
        // arrange
        connectionStore = stub<ConnectionStore>();
        authStore = new AuthStore();
        disabledGameStore = new DisabledGameStore();
        disabledGameStore.setGameStatus = jest.fn();
        disabledGameStore.setShowPopup = jest.fn();

        noticeStore = new NoticeStore();
        noticeStore.addNotice = jest.fn();

        roundTimeStore = new RoundTimeStore(gameSettings);
        roundTimeStore.resetRoundTime = jest.fn();
        roundTimeStore.startNewRound = true;

        roundRunningHandlers = new RoundRunningHandlers(roundTimeStore, gameSettings);

        backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore());

        handler = new DisableGameHandlers(
            connectionStore,
            authStore,
            roundTimeStore,
            disabledGameStore,
            noticeStore,
            backToOperatorLobby,
            roundRunningHandlers
        );
    });

    describe("onClosedHandle", () => {
        describe("when already disable game", () => {
            it("should disconnect socket and back to lobby", () => {
                // arrange
                connectionStore.onDisconnected = jest.fn();
                backToOperatorLobby.handle = jest.fn();

                // act
                handler.onClosedHandle();

                // assert
                expect(connectionStore.onDisconnected).toBeCalledTimes(1);
                expect(backToOperatorLobby.handle).toBeCalledTimes(1);
            });
        });
    });

    describe("showPopupHandle", () => {
        const authStoreLangs = [
            ["en-US", fakeDisabledGameInfo["en-US"]],
            ["abc", defaultDisabledMessage],
        ];
        test.each(authStoreLangs)("should set disable game true and open popup.", (authStoreLang, expectedDisabledMessages) => {
            // arrange
            disabledGameStore.disabled = true;
            authStore.language = authStoreLang;

            // act
            handler.showPopupHandle(fakeDisabledGameInfo);

            // assert
            expect(disabledGameStore.setShowPopup).toBeCalledWith(true);
            expect(noticeStore.addNotice).toHaveBeenCalledWith({
                message: expectedDisabledMessages,
                title: "Notice",
                type: NoticeType.Error,
                onClose: expect.any(Function),
            });
        });
    });

    describe("inGameHandle", () => {
        describe("when game is already disabled ", () => {
            describe("when popup is not show and run to next round", () => {
                it("should show popup and clear round running", () => {
                    // arrange
                    disabledGameStore.disabled = true;
                    disabledGameStore.showPopup = false;
                    roundTimeStore.placingBet = 36;
                    roundTimeStore.roundTime = 33;

                    handler.showPopupHandle = jest.fn();
                    roundRunningHandlers.stopRunner = jest.fn();

                    // act
                    handler.inGameHandle(fakeDisabledGameInfo);

                    // assert
                    expect(handler.showPopupHandle).toHaveBeenCalled();
                    expect(roundRunningHandlers.stopRunner).toHaveBeenCalled();
                });
            });

            describe("when popup is already show  and run to next round", () => {
                it("should not show popup and not touch to round running", () => {
                    // arrange
                    disabledGameStore.disabled = true;
                    disabledGameStore.showPopup = true;
                    roundTimeStore.placingBet = 36;
                    roundTimeStore.roundTime = 33;

                    handler.showPopupHandle = jest.fn();
                    roundRunningHandlers.stopRunner = jest.fn();

                    // act
                    handler.inGameHandle(fakeDisabledGameInfo);

                    // assert
                    expect(handler.showPopupHandle).not.toHaveBeenCalled();
                    expect(roundRunningHandlers.stopRunner).not.toHaveBeenCalled();
                });
            });

            describe("when  popup is not show  adnnot run to next round ", () => {
                it("should not show popup", () => {
                    // arrange
                    disabledGameStore.disabled = true;
                    disabledGameStore.showPopup = false;
                    roundTimeStore.placingBet = 36;
                    roundTimeStore.roundTime = 39;

                    handler.showPopupHandle = jest.fn();

                    // act
                    handler.inGameHandle(fakeDisabledGameInfo);

                    // assert
                    expect(handler.showPopupHandle).not.toHaveBeenCalled();
                });
            });
        });

        describe("when game is enable ", () => {
            it("should call stores", () => {
                // arrange
                disabledGameStore.disabled = false;
                roundTimeStore.placingBet = 36;
                roundTimeStore.roundTime = 39;

                // act
                handler.inGameHandle(fakeDisabledGameInfo);

                // assert
                expect(disabledGameStore.setGameStatus).toBeCalledTimes(1);
                expect(roundTimeStore.resetRoundTime).toBeCalledTimes(1);
            });
        });
    });

    describe("joinGameHandle", () => {
        it("should show popup", () => {
            // arrange
            handler.showPopupHandle = jest.fn();

            // act
            handler.joinGameHandle(fakeDisabledGameInfo);

            // assert
            expect(handler.showPopupHandle).toHaveBeenCalled();
        });
    });

    describe("handle", () => {
        test.each([
            [true, 1, 0],
            [false, 0, 1],
        ])("should call in game and join game handle correctly.", (endRound, expectedNumerousInGameCall, expectedNumerousJoinGameCall) => {
            // arrange
            roundTimeStore.endRound = endRound;
            handler.inGameHandle = jest.fn();
            handler.joinGameHandle = jest.fn();

            // act
            handler.handle(fakeDisabledGameInfo);

            // assert
            expect(handler.inGameHandle).toBeCalledTimes(expectedNumerousInGameCall);
            expect(handler.joinGameHandle).toBeCalledTimes(expectedNumerousJoinGameCall);
        });
    });
});
