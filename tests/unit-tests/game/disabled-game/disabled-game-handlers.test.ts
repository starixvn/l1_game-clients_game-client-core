import { AppStore } from "../../../../src/app/app-store";
import { GameServiceMessage } from "../../../../src/shared";
import { StorageManager, localStorageKeys } from "../../../../src/shared/utils/storage-manager";
import { DisableGameHandlers, DisabledGameStore } from "../../../../src/game/disabled-game";
import { NoticeStore, NoticeType } from "../../../../src/game/notices";
import { AppHandlers } from "../../../../src/app";

jest.mock("../../../../src/shared/utils/storage-manager", () => ({
    StorageManager: {
        get: jest.fn().mockReturnValue({ language: "en-US" }),
        remove: jest.fn(),
    },
    localStorageKeys: { session: "session-key" },
}));

jest.mock("../../../../src/shared/utils/localized-utils", () => {
    return {
        LocalizedUtils: {
            getLocalizedText: jest.fn().mockImplementation((key, option) => key),
        },
    };
});

const fakeDisabledGameInfo: GameServiceMessage.DisabledGameInfo = {
    "vi-VN": "",
    "en-US": "",
    "zh-CN": "",
    "zh-TW": "",
    "th-TH": "",
    "id-ID": "",
};
let disabledGameStore, noticeStore, backToOperatorLobby, handler;

describe("DisableGameHandlers tests", () => {
    describe("handle", () => {
        beforeAll(() => {
            // arrange
            disabledGameStore = new DisabledGameStore();
            disabledGameStore.setGameStatus = jest.fn();

            noticeStore = new NoticeStore();
            noticeStore.addNotice = jest.fn();

            backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore());
        });
        describe("when already disable game", () => {
            it("should not set store", () => {
                // arrange
                disabledGameStore.disabled = true;
                handler = new DisableGameHandlers(disabledGameStore, noticeStore, backToOperatorLobby);

                // act
                handler.handle(fakeDisabledGameInfo);

                // assert
                expect(disabledGameStore.setGameStatus).not.toHaveBeenCalled();
                expect(noticeStore.addNotice).not.toHaveBeenCalled();
            });
        });

        describe("when set disable game fisrt time", () => {
            it("should set disable game true", () => {
                // arrange
                disabledGameStore.disabled = false;
                handler = new DisableGameHandlers(disabledGameStore, noticeStore, backToOperatorLobby);

                // act
                handler.handle(fakeDisabledGameInfo);

                // assert
                expect(disabledGameStore.setGameStatus).toBeCalledWith(true);
                // expect(noticeStore.addNotice).toHaveBeenCalledWith({
                //     message: "",
                //     title: "Notice",
                //     type: NoticeType.Error,
                //     onClose: () => {},
                // });
            });
        });
    });
});
