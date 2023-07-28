import { AppHandlers, AppStore } from "../../../src/app";
import { GameUtils, StorageManager, BrowserDomUtils } from "../../../src/shared/utils";
import { PlayerSelectionHandlers, PlayerSelectionStore } from "../../../src/game/player-selections";

jest.mock("../../../src/shared/utils");

describe("AppHandlers", () => {
    describe("BackToLobby", () => {
        let appStore: AppStore;
        let handler: AppHandlers.BackToOperatorLobby;
        beforeEach(() => {
            appStore = new AppStore();
            handler = new AppHandlers.BackToOperatorLobby(appStore, new PlayerSelectionHandlers.ClearHandlers(new PlayerSelectionStore()));
        });
        describe("when app store has return url", () => {
            beforeEach(() => {
                appStore.urlInfo = { returnUrl: "rurl" };
                GameUtils.base64Decode = jest.fn().mockReturnValue("returnUrl");
                BrowserDomUtils.replaceParentLocation = jest.fn();
            });
            describe("when is direct mode", () => {
                it("should call BrowserDomUtils.replaceParentLocation", () => {
                    // arrange
                    appStore.isDirectMode = true;

                    // act
                    handler.handle();

                    // assert
                    expect(BrowserDomUtils.replaceParentLocation).toHaveBeenCalledWith("returnUrl");
                });
            });

            describe("when is not direct mode", () => {
                const session = {
                    isAuthenticated: true,
                    session: "session",
                    memberName: "",
                    username: "",
                    ssoTime: new Date("2023-01-01"),
                    language: "en",
                };

                beforeEach(() => {
                    appStore.isDirectMode = false;
                    StorageManager.get = jest.fn().mockReturnValueOnce(session);
                });
                it("should call BrowserDomUtils.postMessageToParent", () => {
                    // act
                    handler.handle();

                    // assert
                    expect(BrowserDomUtils.postMessageToParent).toHaveBeenCalledWith({
                        isAuthenticated: true,
                        ss: "session",
                        memberName: "",
                        username: "",
                        language: "en",
                        time: 1672531200000,
                        backLobby: true,
                    });
                });
            });

            it("should set isLoading true into app store", () => {
                // arrange
                appStore.isLoading = false;
                appStore.isDirectMode = true;

                // act
                handler.handle();

                // assert
                expect(appStore.isLoading).toBe(true);
            });
        });
        describe("when app store not has return url", () => {
            it("should not do anything", () => {
                // arrange
                BrowserDomUtils.replaceParentLocation = jest.fn();
                BrowserDomUtils.postMessageToParent = jest.fn();
                appStore.isLoading = false;
                appStore.urlInfo = {};

                // act
                handler.handle();

                // assert
                expect(appStore.isLoading).toBe(false);
                expect(BrowserDomUtils.replaceParentLocation).not.toHaveBeenCalled();
                expect(BrowserDomUtils.postMessageToParent).not.toHaveBeenCalled();
            });
        });
    });
});
