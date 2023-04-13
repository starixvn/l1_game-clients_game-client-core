import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { AuthStore } from "../auth/auth-store";
import { GameServiceMessage } from "../shared";

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
  browserUserAgent = "";

    setAuthorizeStore(user: GameServiceMessage.User) {
        this.UID = user.UID;
        this.name = user.name;
        this.avatarId = user.avatarId;
        this.setBalance(user.red, user.scoins, user.availSpins);
        this.currency = user.currency;
        this.offerGames = user.offerGames;
        this.fractionalOddsFormat = user.fractionalOddsFormat;
        this.displayPlayerCurrency = user.isDisplayPlayerCurrency;
    }

    setBalance(balance: number, scoin: number, availSpins: number) {
        this.balance = balance ?? 0;
        scoin && (this.scoin = scoin);
        availSpins && (this.availSpins = availSpins);
    }

    setStakeLevel(stakeLevel: GameServiceMessage.UserStakeLevel) {
        stakeLevel && (this.stakeLevel = stakeLevel);
    }
}
