import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { ButtonState } from "../game-crash-messages";
import { PlayerActionStore } from "../player-actions";

@injectable()
export class EarlyBetStore {
    get earlyBetEnable(): boolean {
        return this.playerActionStore.buttonState === ButtonState.CANCEL_BET;
    }

    constructor(@inject(PlayerActionStore) protected readonly playerActionStore: PlayerActionStore) {
        makeAutoObservable(this);
    }
}
