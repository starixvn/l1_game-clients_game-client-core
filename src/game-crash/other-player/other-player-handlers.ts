import { inject, injectable } from "inversify";

import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
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
        this.otherPlayerStore.otherPlayer = this.betListHandler.convertCurrencyCashOut(otherPlayer);
        this.betListHandler.updateBetListCashOut(this.otherPlayerStore.otherPlayer);
    }
}
