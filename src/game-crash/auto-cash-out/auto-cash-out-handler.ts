import { inject, injectable } from "inversify";

import { AutoCashOutStore } from "./auto-cash-out-store";

@injectable()
export class AutoCashOutHandler {
    constructor(@inject(AutoCashOutStore) private readonly autoCashOutStore: AutoCashOutStore) {}

    handleEnable(enable: boolean) {
        this.autoCashOutStore.enable = enable;
    }

    handleMultiplier(multiplier: number) {
        this.autoCashOutStore.multiplier = multiplier;
    }

    adjustMultiplier(value: number) {
        this.autoCashOutStore.multiplier = parseFloat((this.autoCashOutStore.multiplier + value).toFixed(2));
    }
}
