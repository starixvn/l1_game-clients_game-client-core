
import { GameServiceMessage } from "../shared";

export namespace GameTurnBaseServiceMessage {
    export const drawId = "drawId";
    export const odds = "odds";

    export type OddsRange = {
        min: GameServiceMessage.Odds,
        max: GameServiceMessage.Odds,
    };

    export class GameConfigs extends GameServiceMessage.GameConfigs {
        oddsRange?: OddsRange;
    }

    export class OwnChip {
        betChoices: string;
        amount: number;

        static eventName = "ownChip";
    }
}
