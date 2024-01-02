import { inject, injectable } from "inversify";

import { CrashGameConfigStore } from "../game-configs/crash-game-config-store";
import { AutoCashOutPopupStore } from "./auto-cash-out-popup-store";

@injectable()
export class AutoCashOutPopupHandler {
    constructor(
        @inject(AutoCashOutPopupStore) private readonly autoCashOutPopupStore: AutoCashOutPopupStore,
        @inject(CrashGameConfigStore) private readonly gameConfigStore: CrashGameConfigStore
    ) {}

    togglePopup(enable: boolean) {
        this.autoCashOutPopupStore.enable = enable;
    }

    handleMultiplier(multiplierString: string) {
        this.autoCashOutPopupStore.multiplier = multiplierString;
        this.autoCashOutPopupStore.isValid = this.isValidMultiplier(multiplierString);
    }

    private isValidMultiplier(multiplier: string): boolean {
        const parsedMultiplier = parseFloat(multiplier);
        return parsedMultiplier >= this.gameConfigStore.minMultiplier && parsedMultiplier <= this.gameConfigStore.maxMultiplier;
    }
}
