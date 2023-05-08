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
    boostedChoices?: GameServiceMessage.Odds = null;

    constructor() {
        makeAutoObservable(this);
    }

    setGameConfigs(gameConfigs: GameServiceMessage.GameConfigs) {
        this.minBet = gameConfigs.minBet;
        this.maxBet = gameConfigs.maxBet;
        this.maxBetPerChoices = gameConfigs.maxBetPerChoices;
        this.stakeLevels = gameConfigs.stakeLevels;
        this.odds = gameConfigs.odds;
        this.enableFreeBet = gameConfigs.enableFreeBet;
        this.originalOdds = gameConfigs.originalOdds;
        this.boostedChoices = gameConfigs.boostedChoices;
        this.chips = gameConfigs.chips;
        console.log("gameConfigs----", gameConfigs);
    }
}
