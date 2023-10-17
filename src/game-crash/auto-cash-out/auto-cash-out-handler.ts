import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import AutoCashOutStore from "./auto-cash-out-store";

@injectable()
export default class AutoCashOutHandler {
    constructor(@inject(AutoCashOutStore) protected readonly autoCashoutStore: AutoCashOutStore) {}
    eventHandleList: IHandler<any, any>[];
    handle(enable: boolean, multiplier: number) {
        this.autoCashoutStore.setEnable = enable;
        this.autoCashoutStore.setMultiplier = multiplier;
    }
}
