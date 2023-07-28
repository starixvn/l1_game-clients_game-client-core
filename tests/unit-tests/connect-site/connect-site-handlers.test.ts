import { stub } from "jest-auto-stub";
import { ConnectSiteHandlers } from "../../../src/connect-site/connect-site-handlers";
import { siteConfigs } from "../container.test";
import { AuthStore } from "../../../src/auth/auth-store";
import { AppStore } from "../../../src/app/app-store";
import { BrowserDomUtils } from "./../../../src/shared/utils";

jest.mock("../../../src/shared/utils", () => ({
    UrlUtils: { buildUrlFromSubDomain: jest.fn().mockReturnValue("connectSite") },
    BrowserDomUtils: { replaceParentLocation: jest.fn() },
}));
describe("ConnectSiteHandlers", () => {
    let authStore: AuthStore;
    beforeEach(() => {
        authStore = stub<AuthStore>({ language: "en" });
    });

    describe("RedirectToTimeoutPage", () => {
        it("should call BrowserDomUtils.replaceParentLocation with App Timeout url", () => {
            // arrange
            const handler = new ConnectSiteHandlers.RedirectToTimeoutPage(siteConfigs, authStore);

            // act
            handler.handle();

            // assert
            expect(BrowserDomUtils.replaceParentLocation).toHaveBeenCalledWith("connectSite/timeout?language=en&");
        });
    });

    describe("RedirectToUMPage", () => {
        it("should call BrowserDomUtils.replaceParentLocation with App UM url", () => {
            // arrange
            const appStore = stub<AppStore>({ umInfo: { operatorId: "operator", startTime: new Date(123), endTime: new Date(321) } });
            const handler = new ConnectSiteHandlers.RedirectToUMPage(siteConfigs, authStore, appStore);

            // act
            handler.handle();

            // assert
            expect(BrowserDomUtils.replaceParentLocation).toHaveBeenCalledWith("connectSite/um?language=en&operatorId=operator");
        });
    });

    describe("RedirectToLoginPage", () => {
        it("should call BrowserDomUtils.replaceParentLocation with App login url", () => {
            // arrange
            const handler = new ConnectSiteHandlers.RedirectToLoginPage(siteConfigs, authStore);

            // act
            handler.handle();

            // assert
            expect(BrowserDomUtils.replaceParentLocation).toHaveBeenCalledWith("connectSite?language=en&");
        });
    });
});
