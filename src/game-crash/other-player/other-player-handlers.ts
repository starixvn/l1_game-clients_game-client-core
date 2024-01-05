import { inject, injectable } from "inversify";

import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { NumberUtils } from "../../shared/utils/number-utils";
import { CrashBetListHandlers } from "../bet-list/crash-bet-list-handlers";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { OtherPlayerStore } from "./other-player-store";

@injectable()
export class OtherPlayerHandlers implements IHandler<GameCrashServiceMessage.CrashOtherPlayer> {
    name = GameCrashServiceMessage.CrashOtherPlayer.eventName;

    constructor(
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(OtherPlayerStore) protected readonly otherPlayerStore: OtherPlayerStore,
        @inject(CrashBetListHandlers) protected readonly betListHandler: CrashBetListHandlers
    ) {}

    handle(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        this.otherPlayerStore.otherPlayer = this.convertCurrency(otherPlayer);
        this.betListHandler.updateBetListCashOut(this.otherPlayerStore.otherPlayer);
    }

    convertCurrency(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const { halfCashOut, cashOut, rate } = otherPlayer;

        if (halfCashOut) {
            otherPlayer.halfCashOut.win = NumberUtils.getValueByCurrency(halfCashOut.win, this.mainPlayerStore.rate, rate);
        }

        if (cashOut) {
            otherPlayer.cashOut.win = NumberUtils.getValueByCurrency(cashOut.win, this.mainPlayerStore.rate, rate);
        }
        return otherPlayer;
    }
}
