import { Socket } from "socket.io-client";
import { Store, MakeObservableFn } from "../common";
import { injectable, inject } from "inversify";

@injectable()
export class SocketIOStore implements Store {
  constructor(@inject("makeObservable") makeObservable: MakeObservableFn) {
    makeObservable(this);
  }

  connection: Socket = {} as any;
}
