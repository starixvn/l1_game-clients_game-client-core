import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MultiplierData } from "./multipliers-define";

@injectable()
export class MultipliersStore<T> {
    constructor(@inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore) {
        makeAutoObservable(this);
    }

    multipliers: MultiplierData<T>[] = [];

    get renderMultipliers() {
        if (!this.roundTimeStore.initialized) {
            return null;
        }
        return {
            animated: this.roundTimeStore.isStartLocking,
            visible: !(this.roundTimeStore.isPlacingBet || this.roundTimeStore.isStartingRound),
            multipliers: this.multipliers,
        };
    }
}
