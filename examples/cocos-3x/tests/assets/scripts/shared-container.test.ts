import { getSharedContainer } from "db://shared-components/scripts/startup";
import mobx from "mobx";
import { configure } from "observer";

import "../../../assets/scripts/shared-container";

jest.mock("db://shared-components/scripts/startup", () => ({
    getSharedContainer: jest.fn(() => ({ sharedContainer: true })),
}));
jest.mock("../../../assets/scripts/site-configs", () => ({ siteConfigs: { mockedConfig: true } }));

describe("when imported", () => {
    it("should create shared container", () => {
        // Assert
        expect(getSharedContainer).toBeCalledWith({ mockedConfig: true });
    });

    it("should configure observer", () => {
        // Assert
        expect(configure).toBeCalledWith({ default: { mobx, container: { sharedContainer: true } } });
    });
});
