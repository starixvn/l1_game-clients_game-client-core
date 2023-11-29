import { inject, injectable } from "inversify";

import { IHandler } from "../../shared";
import { CrashBetListStore } from "../bet-list/crash-bet-list-store";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { OtherPlayerStore } from "./other-player-store";

@injectable()
export class OtherPlayerHandlers implements IHandler<GameCrashServiceMessage.CrashOtherPlayer> {
    name = GameCrashServiceMessage.CrashOtherPlayer.eventName;

    constructor(
        @inject(OtherPlayerStore) protected readonly otherPlayerStore: OtherPlayerStore,
        @inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore
    ) {}

    handle(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        this.otherPlayerStore.otherPlayer = otherPlayer;
        this.betListStore.updateBetListCashOut(this.otherPlayerStore.otherPlayer);
    }
}
