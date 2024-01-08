import { inject, injectable } from "inversify";

import { AutoCashOutPopupStore } from "./auto-cash-out-popup-store";

@injectable()
export class AutoCashOutPopupHandler {
    constructor(@inject(AutoCashOutPopupStore) private readonly autoCashOutPopupStore: AutoCashOutPopupStore) {}

    togglePopup(enable: boolean) {
        this.autoCashOutPopupStore.enable = enable;
    }

    handleMultiplier(multiplierString: string) {
        this.autoCashOutPopupStore.multiplier = multiplierString;
    }
}
