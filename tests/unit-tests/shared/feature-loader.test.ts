import { isMultipleHandlers, isSingleHandler, search } from "../../../src/shared/feature-loader";

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

describe(search.name, () => {
    const roots = [
        {
            name: "Foo",
            age: 10,
            children: [
                {
                    name: "Foo1",
                    age: 15,
                },
            ],
        },
        {
            name: "Bar",
            age: 20,
        },
    ];

    it("should return an empty array when no objects match the condition", () => {
        // Arrange
        const condition = (object) => object.age === 30;

        // Act
        const result = search(roots, condition);

        // Assert
        expect(result).toEqual([]);
    });

    it("should return an array with the objects that match the condition", () => {
        // Arrange
        const condition = (object) => object.age === 20;

        // Act
        const result = search(roots, condition);

        // Assert
        expect(result).toEqual([
            {
                name: "Bar",
                age: 20,
            },
        ]);
    });

    it("should recurse into objects to find matching objects", () => {
        // Arrange
        const condition = (object) => object.age === 15;

        // Act
        const result = search(roots, condition);

        // Assert
        expect(result).toEqual([
            {
                name: "Foo1",
                age: 15,
            },
        ]);
    });
});
