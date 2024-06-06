import { GameServiceMessage } from "../shared";

export type Card = GameServiceMessage.Card;

export type CardsState = {
    [hand: string]: GameServiceMessage.Card[];
};

export enum BetChoice {
    Banker = "banker",
    Player = "player",
    BankerPair = "bankerPair",
    PlayerPair = "playerPair",
    Tie = "tie",
}
