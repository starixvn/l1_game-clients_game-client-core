import { IHandler, Mediator } from "../../../src/shared";
import container from "../container.test";

describe("Mediator", () => {
    describe("constructor", () => {
        describe("when called", () => {
            it("should create an instance of event emitter", () => {
                // Act
                const mediator = container.resolve(Mediator);

                // Assert
                expect(mediator["event"]).toBeDefined();
            });
        });
    });

    describe("registers a single handler for a specific event", () => {
        // Arrange
        const mediator = new Mediator();
        const handler: IHandler<any> = {
            name: "eventA",
            handle: jest.fn(),
        };

        // Act
        mediator.registerHandler(handler);
        mediator.emit("eventA", "arg1", "arg2");

        // Assert
        expect(handler.handle).toHaveBeenCalledWith("arg1", "arg2");
    });

    describe("registers multiple handlers for specific events", () => {
        // Arrange
        const mediator = new Mediator();
        const mockHandlers = {
            eventHandleList: [
                {
                    name: "eventA",
                    handle: jest.fn(),
                },
                {
                    name: "eventB",
                    handle: jest.fn(),
                },
            ],
        };

        // Act
        mediator.registerHandlers(mockHandlers);
        mediator.emit("eventA", "arg1", "arg2");
        mediator.emit("eventB", "arg1", "arg2");

        // Assert
        expect(mockHandlers.eventHandleList[0].handle).toHaveBeenCalledWith("arg1", "arg2");
        expect(mockHandlers.eventHandleList[1].handle).toHaveBeenCalledWith("arg1", "arg2");
    });

    describe('registers an "on any" handler for all events', () => {
        // Arrange
        const mediator = new Mediator();
        const mockHandler = jest.fn();

        // Act
        mediator.onAny(mockHandler);
        mediator.emit("eventA", "arg1", "arg2");
        mediator.emit("eventB", "arg1", "arg2");

        // Assert
        expect(mockHandler).toHaveBeenCalledTimes(2);
    });
});
