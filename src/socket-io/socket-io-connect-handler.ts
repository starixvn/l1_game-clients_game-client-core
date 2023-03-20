import { inject, injectable } from "inversify";
import { io, ManagerOptions, SocketOptions, Socket } from "socket.io-client";
import { IHandler, Mediator } from "../common";
import { SocketIOStore } from "./socket-io-store";

@injectable()
export class SocketIOConnectHandler {
  constructor(
    @inject(Mediator) protected readonly mediator: Mediator,
    @inject(SocketIOStore) protected readonly store: SocketIOStore
  ) {}

  socket: Socket;
  gameName: string;

  handle(
    options: Partial<
      ManagerOptions & SocketOptions & { socketUri: string; gameName: string }
    >
  ) {
    this.socket = io(options.socketUri, options);
    this.gameName = options.gameName;
    this.socket.on("connect", this.onConnected.bind(this));

    this.store.connection = this.socket;
  }

  onConnected() {
    this.socket.onAny((event: any, value: any) => {
      if (event == this.gameName) {
        Object.entries(value).forEach((entry) => {
          const [key, value] = entry;
          this.mediator.emit(key, value);
        });
      } else {
        this.mediator.emit(event, value);
      }
    });

    this.mediator.onAny((event: any, value: any) => {
      this.socket.emit(event, value);
    });
  }
}
