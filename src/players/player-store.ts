import { injectable, inject } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  GameClientEmitMessage,
  GameServiceMessage,
} from "../models/game-messages";
import { AuthStore } from "../auth/auth-store";

export interface IStakeLevel {
  minBet: number;
  maxBet: number;
}

@injectable()
export class PlayerStore {
  constructor(@inject(AuthStore) private readonly authStore: AuthStore) {
    makeAutoObservable(this);
  }

  stakeLevel: IStakeLevel = { minBet: 0, maxBet: 0 };
  UID = 0;
  name = "";
  balance = 0;
  avatarId = 0;
  language = "en-US";
  ss = "";
  system = 1;
  operatorName: string;
  rate = 1;
  scoin = 0;
  currency = "";
  availSpins?: number = 0;
  fractionalOddsFormat = false;
  displayPlayerCurrency = true;
  offerGames? = null;

  updateAuthorizeStore(data: GameServiceMessage.User) {
    this.UID = data.UID;
    this.name = data.name;
    this.avatarId = data.avatarId;
    this.updateBalance(data.red, data.scoins);
    this.currency = data.currency;
    this.offerGames = data.offerGames;
    this.fractionalOddsFormat = data.fractionalOddsFormat;
    this.displayPlayerCurrency = data.isDisplayPlayerCurrency;
    data.availSpins && (this.availSpins = data.availSpins);
  }

  updateBalance(balance: number, scoin: number) {
    this.balance = balance ?? 0;
    this.scoin = scoin ?? 0;
  }

  signIn(socket) {
    const signIn = new GameClientEmitMessage.Signin();
    signIn.username = this.name;
    signIn.ss = this.ss;
    // signIn.ss = this.authStore.ss;

    socket.emit(GameClientEmitMessage.Signin.eventName, signIn);
  }
}
