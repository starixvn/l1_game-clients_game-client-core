import { injectable, inject } from "inversify";
import { Store, MakeObservableFn } from "../common";

export interface IStakeLevel {
  minBet: number;
  maxBet: number;
}

@injectable()
export class PlayerStore implements Store {
  constructor(@inject("makeObservable") makeObservable: MakeObservableFn) {
    makeObservable(this);
  }

  stakeLevel: IStakeLevel = { minBet: 0, maxBet: 0 };

  name: string = "";

  balance: number = 0;

  avatar: number = 0;
}
