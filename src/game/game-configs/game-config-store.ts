import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class GameConfigStore {
    minBet = 0;
    maxBet = 0;
    maxBetPerChoices: GameServiceMessage.MaxBetPerChoices = {};
    chips: string[] = [];
    stakeLevels: string[] = [];
    odds: GameServiceMessage.Odds = {};
    enableFreeBet = false;
    originalOdds?: GameServiceMessage.Odds = null;
    boostedChoices?: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setGameConfigs(gameConfigs: GameServiceMessage.GameConfigs) {
        if (gameConfigs) {
            if (gameConfigs.enableFreeBet === undefined) {
                gameConfigs.enableFreeBet = false;
            }
            Object.assign(this, gameConfigs);
        }
    }
}
