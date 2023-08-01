import { GameUtils } from "../../../../src/shared/utils/game-utils";
import { BrowserDomUtils } from "../../../../src/shared/utils/browser-dom-utils";

jest.mock("../../../../src/shared/utils/browser-dom-utils");

describe("GameUtils", () => {
    describe("base64Decode", () => {
        it("should decode a base64-encoded string", () => {
            // arrange
            const encoded = "SGVsbG8gV29ybGQ=";

            // act
            const decoded = GameUtils.base64Decode(encoded);

            // assert
            expect(decoded).toBe("Hello World");
        });
    });

    describe("base64Encode", () => {
        it("should encode a string as base64", () => {
            // arrange
            const decoded = "Hello World";

            // act
            const encoded = GameUtils.base64Encode(decoded);

            // assert
            expect(encoded).toBe("SGVsbG8gV29ybGQ=");
        });
    });

    describe("copyToClipboard", () => {
        it("should call ", async () => {
            // arrange
            const data = "Hello World";

            // act
            await GameUtils.copyToClipboard(data);

            // assert
            expect(BrowserDomUtils.postMessageToParent).toHaveBeenCalledWith({ copyToClipboard: data });
        });
    });
});
