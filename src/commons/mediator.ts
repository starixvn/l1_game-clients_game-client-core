import { EventEmitter } from "events";

export class Mediator extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(0);
  }
}
