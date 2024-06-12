import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { CardIndexStore } from "./card-index-store";

@injectable()
export class CardIndexHandlers implements IMultipleHandlers {
    constructor(@inject(CardIndexStore) protected readonly cardIndexStore: CardIndexStore) {}

    handleCardIndex(cardIndex: GameServiceMessage.BaccaratX) {
        this.cardIndexStore.cardIndex = cardIndex;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.BaccaratX.eventName,
            handle: this.handleCardIndex,
        },
    ];
}
