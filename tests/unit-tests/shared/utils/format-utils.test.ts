import { FormatUtils } from "../../../../src/shared/utils";

describe("FormatUtils", () => {
    describe("formatOdds", () => {
        const testCases = [
            [2, true, "1:1"],
            [3, false, "1:3"],
            [4, true, "3:1"],
            [5, false, "1:5"],
        ];

        test.each(testCases)('formatOdds(%p, %p) returns "%p"', (value, fractional, expected) => {
            expect(FormatUtils.formatOdds(+value, !!fractional)).toBe(expected);
        });
    });

    describe("numberWithCommas", () => {
        const testCases = [
            [1000, 1, true, "1,000"],
            [12345.67, 2, false, "12,345.67"],
            [0, 1, true, ""],
            [50000, 0, true, "50,000"],
            [12345.6755555513123, 2, false, "12,345.68"],
        ];

        test.each(testCases)('numberWithCommas(%p, %p, %p) returns "%p"', (number, toFixed, noZeroSuffix, expected) => {
            expect(FormatUtils.numberWithCommas(+number, +toFixed, !!noZeroSuffix)).toBe(expected);
        });
    });
});
