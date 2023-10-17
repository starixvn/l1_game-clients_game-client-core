import { inject, injectable } from "inversify";
import { IMultipleHandlers } from "../../shared";
import AutoCashOutStore from "./auto-cash-out-store";

@injectable()
export default class AutoCashOutHandlers implements IMultipleHandlers {
    constructor(@inject(AutoCashOutStore) protected readonly autoCashoutStore: AutoCashOutStore) {}
    handle(enable: boolean, multiplier: number) {
        this.autoCashoutStore.setEnable = enable;
        this.autoCashoutStore.setMultiplier = multiplier;
    }
}
