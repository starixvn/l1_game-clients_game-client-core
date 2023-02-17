import { io, ManagerOptions } from "socket.io-client";
import { Mediator } from "../commons";
import { SocketIOStore } from "./socket-io-store";

export class SocketIOConnectHandler {
  constructor(
    protected readonly mediator: Mediator,
    protected readonly store: SocketIOStore
  ) {}

  handle(options: ManagerOptions) {
    const socket = io(options);

    socket.on("connection", this.onConnected.bind(this));

    this.store.connection = socket;
  }

  onConnected(connection: any) {
    connection.onAny(this.mediator.emit.bind(this.mediator));

    this.mediator.onAny(connection.emit.bind(connection));
  }
}
