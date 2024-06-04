import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export type ChoicesMultipliers = {
    [betChoice: string]: {
        value: number;
        multipliers: number[];
    };
};

@injectable()
export class BaccaratMultipliersStore<T> {
    constructor() {
        makeAutoObservable(this);
    }

    choicesMultipliers: ChoicesMultipliers = {};
}
