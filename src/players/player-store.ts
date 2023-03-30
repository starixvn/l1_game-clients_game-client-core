import { injectable, inject } from "inversify";
import { SocketIOConnector } from "../socket-io/socket-io-connector";
import { makeAutoObservable } from "mobx";

export interface IStakeLevel {
  minBet: number;
  maxBet: number;
}

@injectable()
export class PlayerStore {
  constructor(
    @inject(SocketIOConnector) private socketConnector: SocketIOConnector
  ) {
    makeAutoObservable(this);
  }

  stakeLevel: IStakeLevel = { minBet: 0, maxBet: 0 };

  name = "";

  balance = 0;

  avatarId = 0;

  language = "en-US";

  ss = "";

  system = 1;

  operatorName: string;

  rate = 1;

  scoin = 0;

  signIn() {
    this.socketConnector?.send("signin", {
      name: this.name,
      ss: this.ss,
    });
  }
}
