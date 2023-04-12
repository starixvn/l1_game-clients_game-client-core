import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";

@injectable()
export class GameConfigStore {
    minBet: number = 0;
    maxBet: number = 0;
    maxBetPerChoices: any = {};
    chips: string[] = [];
    stakeLevels: [] = [];
    odds: any = {};
    enableFreeBet: boolean = false;
    originalOdds?: any = null;
    boostedChoices?: any = null;

    constructor() {
        makeAutoObservable(this);
    }

    updateGameConfigs(gameConfigs: GameServiceMessage.GameConfigs) {
        gameConfigs?.minBet && (this.minBet = gameConfigs.minBet);
        gameConfigs?.maxBet && (this.maxBet = gameConfigs.maxBet);
        gameConfigs?.maxBetPerChoices && (this.maxBetPerChoices = gameConfigs.maxBetPerChoices);
        gameConfigs?.chips && (this.chips = gameConfigs.chips);
        gameConfigs?.stakeLevels && (this.stakeLevels = gameConfigs.stakeLevels);
        gameConfigs?.odds && (this.odds = gameConfigs.odds);
        this.enableFreeBet = gameConfigs.enableFreeBet;
        gameConfigs?.originalOdds && (this.originalOdds = gameConfigs.originalOdds);
        gameConfigs?.boostedChoices && (this.boostedChoices = gameConfigs.boostedChoices);
    }
}
