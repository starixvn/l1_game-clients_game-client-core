import { inject, injectable } from "inversify";
import { IMultipleHandlers } from "../../shared";
import { BaccaratXServiceMessage } from "../baccaratx-messages";
import { BaccaratXGameConfigStore } from "../game-configs";
import { ExtraFeeStore } from "./extra-fee-store";

@injectable()
export class ExtraFeeHandlers implements IMultipleHandlers {
    constructor(
        @inject(ExtraFeeStore) protected readonly extraFeeStore: ExtraFeeStore,
        @inject(BaccaratXGameConfigStore) protected readonly gameConfigStore: BaccaratXGameConfigStore
    ) {}

    private handleOwnBets(ownBets: BaccaratXServiceMessage.BaccaratOwnBets) {
        if (!ownBets || Object.keys(ownBets).length === 0) {
            this.extraFeeStore.extraFee = { isRatio: true, fee: this.gameConfigStore.extraFeeRatio };
        } else {
            this.extraFeeStore.extraFee = { isRatio: false, fee: ownBets.fee };
            // if (!this.extraFeeStore.extraFee || this.extraFeeStore.extraFee.isRatio) {

            // } else {
            //     this.extraFeeStore.extraFee.fee += ownBets.fee;
            // }
        }
    }

    eventHandleList = [
        {
            name: BaccaratXServiceMessage.BaccaratOwnBets.eventName,
            handle: this.handleOwnBets,
        },
    ];
}
