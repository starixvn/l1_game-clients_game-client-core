import { stub } from "jest-auto-stub";
import { GameServiceMessage } from "../../../../src/shared";
import { ErrorUtils } from "../../../../src/shared/utils";
jest.mock("../../../../src/shared/utils/localization-manager", () => {
    return {
        Translator: {
            translate: jest.fn().mockImplementation((key, option) => key), gameTranslate: jest.fn().mockImplementation((key, option) => key), commonTranslate: jest.fn().mockImplementation((key, option) => key)
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
            expect(result).toEqual("Common.message_error_occurred");
        });

        it("should return the correct error message for valid error codes", () => {
            const result = ErrorUtils.parseErrorCode("1001");
            expect(result).toEqual("Common.message_session_timeout");

            const result2 = ErrorUtils.parseErrorCode("2002");
            expect(result2).toEqual("Common.message_close_account");
        });

        it("should add suffix 'PlaceBet' for CommonErrorCodeList and isPlaceBet = true", () => {
            const result = ErrorUtils.parseErrorCode("1000", true);
            expect(result).toEqual("Common.message_error_occurred_place_bet");
        });

        it("should not add suffix 'PlaceBet' for non-CommonErrorCodeList and isPlaceBet = true", () => {
            const result = ErrorUtils.parseErrorCode("SB1939", true);
            expect(result).toEqual("Common.message_hedge_bet");
        });
    });

    describe("getErrorMessage", () => {
        it("should return a string with the correct error message", () => {
            const notice = stub<GameServiceMessage.Notice>({
                hedgeBetGroup: ["choice1", "choice2"],
                errorCode: "1000",
            });

            const result = ErrorUtils.getErrorMessage(notice);


            expect(result).toBe("Common.message_error_occurred_place_bet");
        });
    });

    describe("createOptionForHedgeBetGroup", () => {
        it("should return a string with the correct error message", () => {
            const hedgeBetGroup = ["choice1", "choice2"];

            const result = ErrorUtils.createOptionForHedgeBetGroup(hedgeBetGroup);

            expect(result["betChoice1"]).toEqual("glossary_choice1");
            expect(result["betChoice2"]).toEqual("glossary_choice2");
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
