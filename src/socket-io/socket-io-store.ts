import { Socket } from "socket.io-client";
import { Store } from "../commons";

export class SocketIOStore extends Store {
  connection: Socket = {} as any;
}
