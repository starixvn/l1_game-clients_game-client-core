import { inject, injectable } from "inversify";
import { io, ManagerOptions, SocketOptions } from "socket.io-client";
import { Mediator } from "../common";
import { SocketIOStore } from "./socket-io-store";

@injectable()
export class SocketIOConnectHandler {
  constructor(
    @inject(Mediator) protected readonly mediator: Mediator,
    @inject(SocketIOStore) protected readonly store: SocketIOStore
  ) {}

  handle(options: Partial<ManagerOptions & SocketOptions>) {
    const socket = io(options);

    socket.on("connection", this.onConnected.bind(this));

    this.store.connection = socket;
  }

  onConnected(connection: any) {
    connection.onAny(this.mediator.emit.bind(this.mediator));

    this.mediator.onAny(connection.emit.bind(connection));
  }
}
