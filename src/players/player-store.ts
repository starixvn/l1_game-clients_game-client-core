import { Store } from "../commons";

export interface IStakeLevel {
  minBet: number;
  maxBet: number;
}

export class PlayerStore extends Store {
  stakeLevel: IStakeLevel = { minBet: 0, maxBet: 0 };

  name: string = "";

  balance: number = 0;

  avatar: number = 0;
}
