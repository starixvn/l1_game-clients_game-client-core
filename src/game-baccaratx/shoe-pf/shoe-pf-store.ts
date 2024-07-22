import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class ShoePFStore {
    constructor() {
        makeAutoObservable(this);
    }
    pf: GameServiceMessage.ShoeVerification = null;
}
