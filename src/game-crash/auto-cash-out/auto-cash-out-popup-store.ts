import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { CrashGameConfigStore } from "../game-configs/crash-game-config-store";

@injectable()
export class AutoCashOutPopupStore {
    private _enable = false;
    private _multiplier = "0";

    constructor(@inject(CrashGameConfigStore) private readonly gameConfigStore: CrashGameConfigStore) {
        makeAutoObservable(this);
    }
    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }

    get isValid(): boolean {
        const parsedMultiplier = parseFloat(this.multiplier);
        return parsedMultiplier >= this.gameConfigStore.minMultiplier && parsedMultiplier <= this.gameConfigStore.maxMultiplier;
    }

    get multiplier(): string {
        return this._multiplier;
    }

    set multiplier(multiplier: string) {
        this._multiplier = multiplier;
    }
}
