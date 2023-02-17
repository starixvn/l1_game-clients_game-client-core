import EventEmitter2 from "eventemitter2";

export interface IListener<Input, Output = any> {
  properties: string[];

  handle(input: Input): Output;
}

export class Mediator extends EventEmitter2 {
  constructor() {
    super();

    this.setMaxListeners(0);
  }

  registerListener(listener: IListener<any>) {
    listener.properties.forEach((property) => {
      this.on(property, listener.handle.bind(listener));
    });
  }
}
