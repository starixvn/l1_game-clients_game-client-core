import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameConfigStore } from "../game/game-configs";

@injectable()
export class CrashGameConfigStore extends GameConfigStore {
    maxMultiplier: number;

    constructor() {
        super();
        makeAutoObservable(this);
    }
}
