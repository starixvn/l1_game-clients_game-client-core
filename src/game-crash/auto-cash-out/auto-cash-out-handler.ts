import { inject, injectable } from "inversify";

import { AutoCashOutStore } from "./auto-cash-out-store";

@injectable()
export class AutoCashOutHandler {
    constructor(@inject(AutoCashOutStore) private readonly autoCashoutStore: AutoCashOutStore) {}

    handleEnable(enable: boolean) {
        this.autoCashoutStore.enable = enable;
    }

    handleMultiplier(multiplier: number) {
        this.autoCashoutStore.multiplier = multiplier;
    }

    adjustMultiplier(value: number) {
        this.autoCashoutStore.multiplier = parseFloat((this.autoCashoutStore.multiplier + value).toFixed(2));
    }

    handleDisableAuto(disable: boolean) {
        this.autoCashoutStore.disable = disable;
    }
}
