import { Socket } from "socket.io-client";
import { Store } from "../commons";
import { injectable } from "inversify";

@injectable()
export class SocketIOStore extends Store {
  connection: Socket = {} as any;
}
