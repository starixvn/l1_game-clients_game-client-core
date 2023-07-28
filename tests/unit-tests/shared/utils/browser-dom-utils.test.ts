import { BrowserDomUtils } from "../../../../src/shared/utils/browser-dom-utils";
import { GameUtils } from "../../../../src/shared/utils/game-utils";
import { StorageManager } from "../../../../src/shared/utils/storage-manager";

jest.mock("../../../../src/shared/utils/storage-manager");
jest.mock("../../../../src/shared/utils/game-utils");

describe("BrowserDomUtils", () => {
    describe("replaceParentLocation()", () => {
        it("should replace the parent location with the specified URL", () => {
            // arrange
            const mockReplace = jest.fn();
            Object.defineProperty(window, "parent", { value: { location: { replace: mockReplace } }, writable: true });
            const url = "https://example.com";

            // act
            BrowserDomUtils.replaceParentLocation(url);

            // assert
            expect(mockReplace).toHaveBeenCalledWith(url);
        });
    });

    describe("postMessageToParent()", () => {
        it("should post a message to the parent window with the decoded return URL", () => {
            // arrange
            const mockGet = jest.fn().mockReturnValueOnce("dXJsPWh0dHBzOi8vZXhhbXBsZS5jb20=");
            (StorageManager.get as jest.Mock).mockImplementationOnce(mockGet);
            const mockPostMessage = jest.fn();
            Object.defineProperty(window, "parent", { value: { postMessage: mockPostMessage }, writable: true });
            const data = { message: "Hello, parent window!" };
            GameUtils.base64Decode = jest.fn().mockReturnValue("https://example.com");

            // act
            BrowserDomUtils.postMessageToParent(data);

            // assert
            expect(mockGet).toHaveBeenCalledWith("rurl");
            expect(GameUtils.base64Decode).toHaveBeenCalledWith("dXJsPWh0dHBzOi8vZXhhbXBsZS5jb20=");
            expect(mockPostMessage).toHaveBeenCalledWith(data, "https://example.com");
        });

        it("should not post a message if the return URL is not found", () => {
            // arrange
            (StorageManager.get as jest.Mock).mockReturnValueOnce(null);
            const mockPostMessage = jest.fn();
            Object.defineProperty(window, "parent", { value: { postMessage: mockPostMessage }, writable: true });

            // act
            BrowserDomUtils.postMessageToParent({});

            // assert
            expect(mockPostMessage).not.toHaveBeenCalled();
        });
    });
});
