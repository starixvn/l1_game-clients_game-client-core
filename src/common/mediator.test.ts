import { IListener, Mediator } from ".";
import container from "../container.test";
import { EventEmitter2 } from "eventemitter2";

describe(Mediator.name, () => {
  let mediator: Mediator;
  let event: EventEmitter2;

  beforeEach(() => {
    mediator = container.resolve(Mediator);

    event = {
      on: jest.fn(),
      onAny: jest.fn(),
      emit: jest.fn(),
    } as any;

    mediator["event"] = event;
  });

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

  describe("registerListener", () => {
    describe("when called", () => {
      it("should register an event", () => {
        // Arrange
        const listener: IListener<any> = {
          handle: jest.fn(),
          properties: ["event"],
        };

        // Act
        mediator.registerListener(listener);

        // Assert
        expect(event.on).toBeCalledWith("event", expect.any(Function));
      });
    });
  });

  describe("onAny", () => {
    describe("when called", () => {
      it("should call onAny method", () => {
        // Arrange
        const listener = jest.fn();

        // Act
        mediator.onAny(listener);

        // Assert
        expect(event.onAny).toBeCalledWith(listener);
      });
    });
  });

  describe("emit", () => {
    describe("when called", () => {
      it("should call emit method", () => {
        // Act
        mediator.emit("event", 1, 2);

        // Assert
        expect(event.emit).toBeCalledWith("event", 1, 2);
      });
    });
  });
});
