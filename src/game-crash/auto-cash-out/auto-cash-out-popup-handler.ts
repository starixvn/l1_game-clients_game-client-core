import { inject, injectable } from "inversify";

import { CrashGameConfigStore } from "../game-configs/crash-game-config-store";
import { AutoCashOutPopupStore } from "./auto-cash-out-popup-store";

@injectable()
export class AutoCashOutPopupHandler {
    constructor(
        @inject(AutoCashOutPopupStore) private readonly autoCashoutPopupStore: AutoCashOutPopupStore,
        @inject(CrashGameConfigStore) private readonly gameConfigStore: CrashGameConfigStore
    ) {}

    togglePopup(enable: boolean) {
        this.autoCashoutPopupStore.enable = enable;
    }

    handleMultiplier(multiplierString: string) {
        this.autoCashoutPopupStore.multiplier = multiplierString;

        const multiplier = parseFloat(multiplierString);
        this.autoCashoutPopupStore.isValid = multiplier >= 1.01 && multiplier <= this.gameConfigStore.maxMultiplier;
    }
}
