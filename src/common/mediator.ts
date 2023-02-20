import { EventEmitter2 } from "eventemitter2";
import { injectable } from "inversify";

export interface IHandler<Input, Output = any> {
  eventNames: string[];

  handle(input: Input): Output;
}

@injectable()
export class Mediator {
  private event = new EventEmitter2({ maxListeners: 0 });

  registerHandler(handler: IHandler<any>) {
    handler.eventNames.forEach((property) => {
      this.event.on(property, handler.handle.bind(handler));
    });
  }

  registerHandlers(handlers: IHandler<any>[]) {
    if (handlers && handlers.length > 0) {
      handlers.forEach((handler) => this.registerHandler(handler));
    }
  }

  onAny(handler: (...params: any[]) => void) {
    this.event.onAny(handler);
  }

  emit(event: string, ...value: any[]) {
    this.event.emit(event, ...value);
  }
}
