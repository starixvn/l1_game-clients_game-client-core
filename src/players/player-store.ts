import { injectable, inject } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client";
import { GameClientEmitMessage } from "../models/game-messages";

export interface IStakeLevel {
  minBet: number;
  maxBet: number;
}

@injectable()
export class PlayerStore {
  constructor() {
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

  signIn(socket: Socket) {
    const signIn = new GameClientEmitMessage.Signin();
    signIn.username = this.name;
    signIn.ss = this.ss;

    socket.emit(GameClientEmitMessage.Signin.eventName, signIn);
  }
}
