import { inject, injectable } from "inversify";

import { IHandler } from "../../shared";
import { CrashBetListHandlers } from "../bet-list";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { OtherPlayerStore } from "./other-player-store";

@injectable()
export class OtherPlayerHandlers implements IHandler<GameCrashServiceMessage.CrashOtherPlayer> {
    name = GameCrashServiceMessage.CrashOtherPlayer.eventName;

    constructor(
        @inject(OtherPlayerStore) protected readonly otherPlayerStore: OtherPlayerStore,
        @inject(CrashBetListHandlers) protected readonly betListHandler: CrashBetListHandlers
    ) {}

    handle(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        this.otherPlayerStore.otherPlayer = otherPlayer;
        this.betListHandler.updateBetListCashOut(this.otherPlayerStore.otherPlayer);
    }
}
