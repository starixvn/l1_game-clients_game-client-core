import { injectable, inject } from "inversify";
import { Store, MakeObservableFn } from "../common";
import { SocketIOConnector } from "../socket-io/socket-io-connector";
import { SocketIOStore } from "../socket-io/socket-io-store";

export interface IStakeLevel {
  minBet: number;
  maxBet: number;
}

@injectable()
export class PlayerStore implements Store {
  constructor(
    @inject("makeObservable") makeObservable: MakeObservableFn,
    @inject(SocketIOConnector) private socketConnector: SocketIOConnector
  ) {
    makeObservable(this);
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
