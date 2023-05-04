// Needs to be higher than the default Playwright timeout
jest.setTimeout(40 * 1000);

describe("Demo", () => {
    it("should pass test", async () => {
        await page.goto("http://localhost:7456/token=aaa");
    });
});
