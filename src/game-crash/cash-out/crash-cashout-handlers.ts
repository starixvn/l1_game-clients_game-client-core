import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { RoundTimeStore } from "../../game/rounds";
import { IHandler } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutHandlers implements IHandler<GameCrashServiceMessage.CrashCashoutInfo> {
    name = GameCrashServiceMessage.CrashCashoutInfo.eventName;
    constructor(
        @inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isPlacingBet,
            (isPlacingBet) => {
                if (isPlacingBet) {
                    console.log("isPlacingBet");
                    this.cashoutStore.isCashedOut = false;
                }
            }
        );
    }
    handle(cashOut: GameCrashServiceMessage.CrashCashoutInfo | undefined) {
        this.cashoutStore.cashoutAmount = cashOut.win;
        this.cashoutStore.isCashedOut = true;
    }
}
