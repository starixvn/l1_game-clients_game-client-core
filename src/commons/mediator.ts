import { EventEmitter2 } from "eventemitter2";
import { injectable } from "inversify";

export interface IListener<Input, Output = any> {
  properties: string[];

  handle(input: Input): Output;
}

@injectable()
export class Mediator {
  private event = new EventEmitter2({ maxListeners: 0 });

  registerListener(listener: IListener<any>) {
    listener.properties.forEach((property) => {
      this.event.on(property, listener.handle.bind(listener));
    });
  }

  onAny(listener: (...params: any[]) => void) {
    this.event.onAny(listener);
  }

  emit(event: string) {
    this.event.emit(event);
  }
}
