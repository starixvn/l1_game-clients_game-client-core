import { isMultipleHandlers, isSingleHandler } from "../../../src/shared/feature-loader";

describe(isMultipleHandlers.name, () => {
    describe("when the handler instance has the eventHandleList property", () => {
        it("should return true", () => {
            // Act
            const actual = isMultipleHandlers({ eventHandleList: true } as any);

            // Assert
            expect(actual).toBeTruthy();
        });
    });

    describe("when the handler instance is null or doesn't have the eventHandleList property", () => {
        test.each([[null], [{}]])("should return false", (handler: any) => {
            // Act
            const actual = isMultipleHandlers(handler);

            // Assert
            expect(actual).toBeFalsy();
        });
    });
});

describe(isSingleHandler.name, () => {
    describe("when the handler instance has the name and handle properties", () => {
        it("should return true", () => {
            // Act
            const actual = isSingleHandler({ name: "name", handle: true } as any);

            // Assert
            expect(actual).toBeTruthy();
        });
    });

    describe("when the handler instance is null or doesn't have the name and handle properties", () => {
        test.each([[null], [{}], [{ name: "name" }], [{ handle: true }]])("should return false", (handler: any) => {
            // Act
            const actual = isSingleHandler(handler);

            // Assert
            expect(actual).toBeFalsy();
        });
    });
});
