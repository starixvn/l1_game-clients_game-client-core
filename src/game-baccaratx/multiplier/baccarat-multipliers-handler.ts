import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { MultipliersStore } from "../../features/multipliers/multipliers-store";
import { GameConfigStore } from "../../game/game-configs";
import { RoundTimeStore } from "../../game/rounds";
import { GameServiceMessage } from "../../shared";
import { IHandler, IMultipleHandlers } from "../../shared/mediator";
import { BetChoice, Card, CardsState } from "../baccarat-defines";
import { BaccaratMultipliersStore } from "./baccarat-multipliers-store";

@injectable()
export class BaccaratMultipliersHandler implements IMultipleHandlers {
    constructor(
        @inject(MultipliersStore) private readonly multipliersStore: MultipliersStore<Card>,
        @inject(GameConfigStore) private readonly gameConfigStore: GameConfigStore,
        @inject(BaccaratMultipliersStore) private readonly baccaratMultipliersStore: BaccaratMultipliersStore<Card>,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isStartRound,
            (isStartRound) => {
                if (isStartRound) {
                    this.resetPossiblePayout();
                }
            }
        );
    }

    eventHandleList: IHandler<any, any>[] = [
        {
            name: GameServiceMessage.Finish.eventName,
            handle: this.receivedFinaleOdds,
        },
        {
            name: GameServiceMessage.BaccaratMultiplierCards.eventName,
            handle: this.receivedMultiplierCards,
        },
    ];

    resetPossiblePayout() {
        this.baccaratMultipliersStore.possiblePayout = {};
    }

    receivedMultiplierCards(multiplierCards: GameServiceMessage.BaccaratCardMultiplier[]) {
        this.convertOddsMultipliers(multiplierCards);
    }

    receivedFinaleOdds(finish: any) {
        if (finish[GameServiceMessage.FinalOdds.eventName]) {
            const finalOdds = finish[GameServiceMessage.FinalOdds.eventName];
            this.baccaratMultipliersStore.finalOdds = finalOdds;
        }
    }

    parseOddsMultiplers(finish: any) {
        if (finish[GameServiceMessage.OddsMultipliers]) {
            const multiplierCards = finish[GameServiceMessage.OddsMultipliers];
            this.convertOddsMultipliers(multiplierCards);
        }
    }

    handleForNewShoe() {
        this.multipliersStore.multipliers = [];
        this.resetPossiblePayout();
    }

    registerBetChoices(betChoices: string[]) {
        this.baccaratMultipliersStore.betChoices = betChoices;
    }

    convertOddsMultipliers(oddsMultipliers: GameServiceMessage.BaccaratCardMultiplier[]) {
        const multipliers = oddsMultipliers.map((m) => {
            const { rank, suit, value } = m;
            return {
                item: { rank, suit },
                value,
            };
        });

        this.multipliersStore.multipliers = multipliers;
    }

    openCards(cardsState: CardsState) {
        this.baccaratMultipliersStore.betChoices.forEach((betChoice) => {
            const odds = this.gameConfigStore.odds[betChoice];
            const cards = this.getCards(cardsState, betChoice);
            if (cards.length > 0) {
                const multipliers = this.getMultipliersValues(cards);
                if (multipliers.length > 0) {
                    this.updatePossiblePayout(betChoice, multipliers, odds - 1);
                }
            }
        });
    }

    getMultipliersValues(cards: GameServiceMessage.Card[]) {
        const multipliers: number[] = [];

        cards.forEach((card) => {
            const data = this.multipliersStore.multipliers.find((data) => this.isSameCard(card, data.item));
            if (data) {
                multipliers.push(data.value);
            }
        });
        return multipliers;
    }

    calculateScore(cards: GameServiceMessage.Card[]): number {
        return cards.reduce((previous, current) => current.rank + previous, 0);
    }

    isPair(cards: Card[]) {
        if (cards.length < 2) {
            return false;
        }
        return cards[0].rank === cards[1].rank;
    }

    getCards(cardsState: CardsState, betChoice: string) {
        if (betChoice === BetChoice.PlayerPair || betChoice === BetChoice.BankerPair) {
            const hand = betChoice.split("Pair")[0];
            const cards = cardsState[hand];
            if (cards && (cards.length === 1 || this.isPair(cards))) {
                return cards.filter((value, index) => index < 2);
            }
        }
        if (betChoice === BetChoice.Tie) {
            return Object.keys(cardsState).flatMap((hand) => cardsState[hand]);
        }
        return cardsState[betChoice] ?? [];
    }

    updateFinalPayout(settlementResult: GameServiceMessage.TSettlementResult) {
        const payOut = {};
        Object.keys(settlementResult).forEach((key) => {
            if (settlementResult[key] && this.baccaratMultipliersStore.possiblePayout[key]) {
                payOut[key] = { value: this.baccaratMultipliersStore.possiblePayout[key].value };
            }
        });

        this.baccaratMultipliersStore.possiblePayout = payOut;
    }

    updatePossiblePayout(betChoice: string, multiplierValues: number[], fractionalOdds: number) {
        this.baccaratMultipliersStore.possiblePayout[betChoice] = this.baccaratMultipliersStore.possiblePayout[betChoice] ?? {
            value: 0,
            multipliers: [],
        };

        const payout = { ...this.baccaratMultipliersStore.possiblePayout };
        const specificChoiceMultipliers = this.baccaratMultipliersStore.possiblePayout[betChoice];
        specificChoiceMultipliers.multipliers = multiplierValues;

        const resultMultipliers = multiplierValues.reduce((prev, current) => current * prev, fractionalOdds);
        specificChoiceMultipliers.value = 1 + resultMultipliers;
        this.baccaratMultipliersStore.possiblePayout = payout;
    }

    isSameCard(cardA: Card, cardB: Card): boolean {
        return cardA.rank === cardB.rank && cardA.suit === cardB.suit;
    }
}
