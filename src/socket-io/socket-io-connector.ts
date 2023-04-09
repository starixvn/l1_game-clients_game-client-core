import { GameSetting } from "./../core/game-setting";
import { inject, injectable } from "inversify";
import { io } from "socket.io-client/dist/socket.io.js";
import { Mediator } from "../common";
import { SocketIOStore } from "./socket-io-store";

export const events = {
  connect: "connect",
  reconnect: "reconnect",
  connectFailed: "connect_failed",
  connectError: "connect_error",
  disconnect: "disconnect",
};

@injectable()
export class SocketIOConnector {
  constructor(
    @inject(Mediator) protected readonly mediator: Mediator,
    @inject(SocketIOStore) protected readonly store: SocketIOStore,
    @inject(GameSetting) protected readonly gameSetting: GameSetting
  ) {}

  socket: any;

  handle(options) {
    this.socket = io(options.socketUri, options);
    this.socket.on(events.connect, this.onConnected.bind(this));

    this.store.connection = this.socket;
  }

  onConnected() {
    this.socket.onAny((event: string, value: any) => {
      if (
        event?.toLocaleLowerCase() ===
          this.gameSetting?.name.toLocaleLowerCase() ||
        event?.toLocaleLowerCase() == "message"
      ) {
        Object.entries(value).forEach((entry) => {
          const [key, value] = entry;
          this.mediator.emit(key, value);
        });
      } else {
        this.mediator.emit(event, value);
      }
    });

    // this.mediator.onAny((event: any, value: any) => {
    //   this.socket.emit(event, value);
    // });
  }

  onDisconnected() {
    this.socket.disconnect();
  }

  send(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  getSocket() {
    return this.socket;
  }
}
