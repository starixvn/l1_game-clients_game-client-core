import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class BetDetailsStore {
    constructor() {
        makeAutoObservable(this);
    }

    betDetailsUrl: GameServiceMessage.BetDetails = null;
}
