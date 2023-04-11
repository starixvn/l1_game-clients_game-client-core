import { EventEmitter2 } from "eventemitter2";
import { injectable } from "inversify";

export interface IHandler<Input, Output = any> {
  eventNames?: string[];

  handle(input: Input): Output;
}

export interface IMultipleHandlers {
  eventHandleList: { name: string; handle: (param: any) => void }[];
}

@injectable()
export class Mediator {
  private event = new EventEmitter2({ maxListeners: 0 });

  registerHandler(handler: IHandler<any>) {
    handler.eventNames.forEach((property) => {
      this.event.on(property, handler.handle.bind(handler));
    });
  }

  registerHandlers(handlers: IMultipleHandlers) {
    if (handlers && handlers.eventHandleList?.length > 0) {
      handlers.eventHandleList?.forEach((handler) => {
        this.event.on(handler.name, handler.handle.bind(handler));
      });
    }
  }

  registerMultipleHandlers(multipleHandlers: IMultipleHandlers[]) {
    if (multipleHandlers && multipleHandlers.length > 0) {
      multipleHandlers.forEach((handlers) => {
        this.registerHandlers(handlers);
      });
    }
  }

  onAny(handler: (...params: any[]) => void) {
    this.event.onAny(handler);
  }

  emit(event: string, ...value: any[]) {
    this.event.emit(event, ...value);
  }
}
