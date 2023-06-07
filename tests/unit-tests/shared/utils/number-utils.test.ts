import { getRandomInt } from "../../../../src/shared/utils";

describe("getRandomInt", () => {
    const lengthValues = [1, 10, 100, 1000];

    test.each(lengthValues)("getRandomInt(%p) returns a random integer within the range", (length) => {
        const randomInt = getRandomInt(length);
        expect(randomInt).toBeGreaterThanOrEqual(0);
        expect(randomInt).toBeLessThan(length);
        expect(Number.isInteger(randomInt)).toBe(true);
    });
});
