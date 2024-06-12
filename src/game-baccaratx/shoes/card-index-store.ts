import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared/models/game-messages";
@injectable()
export class CardIndexStore {
    constructor() {
        makeAutoObservable(this);
    }

    _cardIndex: GameServiceMessage.BaccaratX = null;

    get cardIndex() {
        return this._cardIndex;
    }

    set cardIndex(cardIndex: GameServiceMessage.BaccaratX) {
        this._cardIndex = cardIndex;
    }
}
