import { stub } from "jest-auto-stub";
import { GameServiceMessage } from "../../../../src/shared";
import { ErrorUtils } from "../../../../src/shared/utils";
jest.mock("../../../../src/shared/utils/localization-manager", () => {
    return {
        Translator: {
            translate: jest.fn(), gameTranslate: jest.fn(), commonTranslate: jest.fn()
        },
    };
});
describe("ErrorUtils", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("parseErrorCode", () => {
        it("should return messages.errorOccurred for undefined error codes", () => {
            const result = ErrorUtils.parseErrorCode("undefined");
            expect(result).toEqual("errorOccurred");
        });

        it("should return the correct error message for valid error codes", () => {
            const result = ErrorUtils.parseErrorCode("1001");
            expect(result).toEqual("sessionTimeout");

            const result2 = ErrorUtils.parseErrorCode("2002");
            expect(result2).toEqual("accountClosed");
        });

        it("should add suffix 'PlaceBet' for CommonErrorCodeList and isPlaceBet = true", () => {
            const result = ErrorUtils.parseErrorCode("1000", true);
            expect(result).toEqual("errorOccurredPlaceBet");
        });

        it("should not add suffix 'PlaceBet' for non-CommonErrorCodeList and isPlaceBet = true", () => {
            const result = ErrorUtils.parseErrorCode("SB1939", true);
            expect(result).toEqual("disallowHedgeBet");
        });
    });

    describe("getErrorMessage", () => {
        it("should return a string with the correct error message", () => {
            const notice = stub<GameServiceMessage.Notice>({
                hedgeBetGroup: ["choice1", "choice2"],
                errorCode: "1000",
            });

            const result = ErrorUtils.getErrorMessage(notice);

            expect(result).toBe("errorOccurredPlaceBet");
        });
    });

    describe("createOptionForHedgeBetGroup", () => {
        it("should return a string with the correct error message", () => {
            const hedgeBetGroup = ["choice1", "choice2"];

            const result = ErrorUtils.createOptionForHedgeBetGroup(hedgeBetGroup);

            expect(result["betChoice1"]).toEqual(hedgeBetGroup[0]);
            expect(result["betChoice2"]).toEqual(hedgeBetGroup[1]);
        });
    });

    describe("isSessionTimeoutError", () => {
        test.each([
            ["1001", true],
            ["1002", true],
            ["SB0002", true],
            ["SB0011", true],
            ["9999", false],
        ])("should return true if error code is one of the expected token error codes", (errorCode, expected) => {
            // Act
            const result = ErrorUtils.isSessionTimeoutError(errorCode);

            // Assert
            expect(result).toBe(expected);
        });
    });
});
