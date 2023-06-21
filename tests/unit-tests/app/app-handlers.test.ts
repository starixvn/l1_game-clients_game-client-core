import { AppHandlers, AppStore } from "../../../src/app";
import { GameUtils, StorageManager } from "../../../src/shared/utils";

jest.mock("../../../src/shared/utils");

describe("AppHandlers", () => {
    describe("BackToLobby", () => {
        let appStore: AppStore;
        let handler: AppHandlers.BackToOperatorLobby;
        beforeEach(() => {
            Object.defineProperty(window, "location", {
                value: {
                    replace: jest.fn(),
                },
                writable: true,
            });
            appStore = new AppStore();
            handler = new AppHandlers.BackToOperatorLobby(appStore);
        });
        describe("when app store has return url", () => {
            beforeAll(() => {
                GameUtils.base64Decode = jest.fn().mockReturnValue("returnUrl");
            });
            beforeEach(() => {
                appStore.urlInfo = { returnUrl: "rurl" };
            });
            describe("when is direct mode", () => {
                it("should call window.location.replace without params", () => {
                    // arrange
                    appStore.isDirectMode = true;

                    // act
                    handler.handle();

                    // assert
                    expect(GameUtils.base64Decode).toHaveBeenCalledWith("rurl");
                    expect(window.location.replace).toHaveBeenCalledWith("returnUrl");
                });
            });

            describe("when is not direct mode", () => {
                it("should call window.location.replace with params", () => {
                    // arrange
                    appStore.isDirectMode = false;
                    const session = { session: "session", ssoTime: new Date("2023-01-01"), language: "en" };
                    StorageManager.get = jest
                        .fn()
                        .mockReturnValueOnce(session)
                        .mockReturnValueOnce({ musicEnable: false, sfxEnable: true });
                    const encodedQueryString = "vOAIwnfowavdis243863OSwmg";
                    GameUtils.base64Encode = jest.fn().mockReturnValue(encodedQueryString);

                    // act
                    handler.handle();

                    // assert
                    expect(GameUtils.base64Encode).toHaveBeenCalledWith(
                        `ss=session&time=${session.ssoTime.getTime()}&musicEnable=false&sfxEnable=true&language=en`
                    );
                    expect(window.location.replace).toHaveBeenCalledWith(`returnUrl?lang=en&params=${encodedQueryString}`);
                });
            });
        });
        describe("when app store not has return url", () => {
            it("should not call window.location.replace", () => {
                // arrange
                appStore.urlInfo = {};

                // act
                handler.handle();

                // assert
                expect(window.location.replace).not.toHaveBeenCalled();
            });
        });
    });
});
