import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { IMultipleHandlers } from "../../shared";
import { BaccaratXServiceMessage } from "../baccaratx-messages";
import { BaccaratXGameConfigStore } from "../game-configs";
import { ExtraFeeStore } from "./extra-fee-store";

@injectable()
export class ExtraFeeHandlers implements IMultipleHandlers {
    constructor(
        @inject(ExtraFeeStore) protected readonly extraFeeStore: ExtraFeeStore,
        @inject(BaccaratXGameConfigStore) protected readonly gameConfigStore: BaccaratXGameConfigStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isStartRound,
            (isStartRound) => isStartRound && this.resetExtraFee()
        );
    }

    private handleOwnBets(ownBets: BaccaratXServiceMessage.BaccaratOwnBets) {
        if (!ownBets || Object.keys(ownBets).length === 0) {
            this.extraFeeStore.extraFee = { isRatio: true, fee: this.gameConfigStore.extraFeeRatio };
        } else {
            this.extraFeeStore.extraFee = { isRatio: false, fee: ownBets.fee };
        }
    }

    private resetExtraFee() {
        this.extraFeeStore.extraFee = { isRatio: true, fee: this.gameConfigStore.extraFeeRatio };
    }

    eventHandleList = [
        {
            name: BaccaratXServiceMessage.BaccaratOwnBets.eventName,
            handle: this.handleOwnBets,
        },
    ];
}
