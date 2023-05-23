import { Container, injectable } from "inversify";
import {
    getAllConstructors,
    getAllFeatures,
    isMultipleHandlers,
    isSingleHandler,
    loadFeature,
    loadFeatures,
    search,
} from "../../../src/shared/feature-loader";
import { Mediator } from "../../../src/shared/mediator";

@injectable()
class MockSingleHandler {
    name = "name";

    handle() {}
}

@injectable()
class MockMultipleHandlers {
    eventHandleList = [];
}

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

describe(getAllFeatures.name, () => {
    const roots = [
        {
            name: "Foo",
            age: 10,
        },
        {
            FEATURE_NAME: "Bar",
            name: "Bar",
            age: 20,
        },
    ];

    it("should return objects that have FEATURE_NAME property", () => {
        // Act
        const actual = getAllFeatures(roots);

        // Assert
        expect(actual).toStrictEqual([
            {
                FEATURE_NAME: "Bar",
                name: "Bar",
                age: 20,
            },
        ]);
    });
});

describe(getAllConstructors.name, () => {
    const roots = [
        {
            name: "Foo",
            age: 10,
        },
        {
            FEATURE_NAME: "Bar",
            single: MockSingleHandler,
            multiple: MockMultipleHandlers,
        },
    ];

    it("should return classes that are injectable", () => {
        // Act
        const actual = getAllConstructors(roots);

        // Assert
        expect(actual).toStrictEqual([MockSingleHandler, MockMultipleHandlers]);
    });
});

describe(loadFeature.name, () => {
    const feature = {
        FEATURE_NAME: "Bar",
        MockSingleHandler,
        MockMultipleHandlers,
    };
    let container: Container;
    let mediator: Mediator;

    beforeEach(() => {
        container = new Container({ defaultScope: "Singleton" });

        container.bind(Mediator).to(Mediator);
        container.bind(MockSingleHandler).to(MockSingleHandler);
        container.bind(MockMultipleHandlers).to(MockMultipleHandlers);

        mediator = container.get(Mediator);

        jest.spyOn(mediator, "registerHandler");
        jest.spyOn(mediator, "registerHandlers");
    });

    it("should register all single handlers", () => {
        // Act
        loadFeature(feature, container);

        // Assert
        expect(mediator.registerHandler).toBeCalled();
    });

    it("should register all multiple handlers", () => {
        // Act
        loadFeature(feature, container);

        // Assert
        expect(mediator.registerHandlers).toBeCalled();
    });
});

describe(loadFeatures.name, () => {
    const features = [
        {
            FEATURE_NAME: "Foo",
            MockSingleHandler,
        },
        {
            FEATURE_NAME: "Bar",
            MockMultipleHandlers,
        },
    ];
    let container: Container;
    let mediator: Mediator;

    beforeEach(() => {
        container = new Container({ defaultScope: "Singleton" });

        container.bind(Mediator).to(Mediator);
        container.bind(MockSingleHandler).to(MockSingleHandler);
        container.bind(MockMultipleHandlers).to(MockMultipleHandlers);

        mediator = container.get(Mediator);

        jest.spyOn(mediator, "registerHandler");
        jest.spyOn(mediator, "registerHandlers");
    });

    describe("when define enabledFeatures property", () => {
        it("should load enabled features", () => {
            // Act
            loadFeatures({ container, enabledFeatures: ["Foo"], features, disabledFeatures: [] });

            // Assert
            expect(mediator.registerHandler).toBeCalled();
        });
    });

    describe("when enabledFeatures property is not defined", () => {
        it("should load all features exclude disabledFeatures", () => {
            // Act
            loadFeatures({ container, disabledFeatures: ["Foo"], features, enabledFeatures: [] });

            // Assert
            expect(mediator.registerHandlers).toBeCalled();
        });
    });
});
