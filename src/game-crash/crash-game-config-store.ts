import { injectable } from "inversify";
import { GameConfigStore } from "../game/game-configs";

@injectable()
export class CrashGameConfigStore extends GameConfigStore {
    maxMultiplier: number;
}
