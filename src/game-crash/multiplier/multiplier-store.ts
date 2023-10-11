import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class MultiplierStore {
    multiplier = 0;
    time = 0;

    constructor() {
        makeAutoObservable(this);
    }
}
