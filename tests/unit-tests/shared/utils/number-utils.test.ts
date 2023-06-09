import { NumberUtils } from "../../../../src/shared/utils";

describe("NumberUtils", () => {
    describe("getRandomInt", () => {
        const lengthValues = [1, 10, 100, 1000];

        test.each(lengthValues)("getRandomInt(%p) returns a random integer within the range", (length) => {
            // Act
            const randomInt = NumberUtils.getRandomInt(length);

            // Assert
            expect(randomInt).toBeGreaterThanOrEqual(0);
            expect(randomInt).toBeLessThan(length);
            expect(Number.isInteger(randomInt)).toBe(true);
        });
    });

    describe("getValueByCurrency", () => {
        test.each([
            [100, 2, 3, 150],
            [100, 2, undefined, 50],
            [200, 5, 4, 160],
            [50, 1, 2, 100],
        ])("calculates the value correctly", (value, playerRate, otherRate, expected) => {
            // Act
            const result = NumberUtils.getValueByCurrency(value, playerRate, otherRate);

            // Assert
            expect(result).toEqual(expected);
        });
    });
});
