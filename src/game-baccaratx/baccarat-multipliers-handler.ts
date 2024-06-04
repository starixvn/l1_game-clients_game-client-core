import { inject, injectable } from "inversify";
import { MultipliersStore } from "../features/multipliers/multipliers-store";
import { GameConfigStore } from "../game/game-configs";
import { IHandler, IMultipleHandlers } from "../shared/mediator";
import { BaccaratMultipliersStore } from "./baccarat-multipliers-store";

export interface Card {
    rank: number;
    suit: number;
}

@injectable()
export class BaccaratMultipliersHandler implements IMultipleHandlers {
    constructor(
        @inject(MultipliersStore) private readonly multipliersStore: MultipliersStore<Card>,
        @inject(GameConfigStore) private readonly gameConfigStore: GameConfigStore,
        @inject(BaccaratMultipliersStore) private readonly baccaratMultipliersStore: BaccaratMultipliersStore<Card>
    ) {}

    eventHandleList: IHandler<any, any>[] = [];

    openCard(betChoice: string, cards: Card[]) {
        const odds = this.gameConfigStore.odds[betChoice];
        if (!odds) {
            return;
        }
        const multipliers: number[] = [];
        cards.forEach((card) => {
            const data = this.multipliersStore.multipliers.find((data) => this.isSameCard(card, data.item));
            if (data) {
                multipliers.push(data.value);
            }
        });
        if (multipliers.length === 0) {
            return;
        }

        this.updateChoicesMultipliers(betChoice, multipliers, odds - 1);
    }

    updateChoicesMultipliers(betChoice: string, multiplierValues: number[], fractionalOdds: number) {
        this.baccaratMultipliersStore.choicesMultipliers[betChoice] = this.baccaratMultipliersStore.choicesMultipliers[betChoice] ?? {
            value: 0,
            multipliers: [],
        };

        const choicesMultipliers = { ...this.baccaratMultipliersStore.choicesMultipliers };
        const specificChoiceMultipliers = this.baccaratMultipliersStore.choicesMultipliers[betChoice];
        specificChoiceMultipliers.multipliers = specificChoiceMultipliers.multipliers ?? [];

        const multipliers = specificChoiceMultipliers.multipliers;
        multipliers.push(...multiplierValues);

        const resultMultipliers = multipliers.reduce((prev, current) => current * prev, fractionalOdds);
        specificChoiceMultipliers.value = 1 + resultMultipliers;

        this.baccaratMultipliersStore.choicesMultipliers = choicesMultipliers;
    }

    isSameCard(cardA: Card, cardB: Card): boolean {
        return cardA.rank === cardB.rank && cardA.suit === cardB.suit;
    }
}
