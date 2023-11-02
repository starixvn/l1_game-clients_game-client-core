import { inject, injectable } from "inversify";
import { OtherPlayerStore } from "./other-player-store";
import { IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";

@injectable()
export class OtherPlayerHandlers implements IMultipleHandlers {
    constructor(@inject(OtherPlayerStore) protected readonly otherPlayerStore: OtherPlayerStore) {}

    handleOtherPlayer(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        this.otherPlayerStore.otherPlayer = otherPlayer;
    }
    eventHandleList = [
        {
            name: GameCrashServiceMessage.CrashOtherPlayer.eventName,
            handle: this.handleOtherPlayer,
        },
    ];
}
