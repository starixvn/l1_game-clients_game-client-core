import { Socket } from "socket.io-client";
import { injectable, inject } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class SocketIOStore {
  constructor() {
    makeAutoObservable(this);
  }

  connection: Socket = {} as any;

  // connection: {
  //   status
  // }
}
