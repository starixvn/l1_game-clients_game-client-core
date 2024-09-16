import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { RoundTimeStore } from "./round-time-store";
import { GameSetting } from "../../game/game-configs";
import { RoundRunningHandlers } from "../../game/rounds";

@injectable()
export class RoundTimeHandlers implements IMultipleHandlers {
    constructor(
        @inject(GameSetting) readonly gameSetting: GameSetting,
        @inject(RoundTimeStore) protected readonly store: RoundTimeStore,
        @inject(RoundRunningHandlers) protected readonly roundRunningHandlers: RoundRunningHandlers
    ) {
    }

    handleRemainingTime(remainingTime: number) {
        console.log(`turn base handleRemainingTime: ${remainingTime}`)

        this.roundRunningHandlers.stopRunner();
        this.store.totalRoundTime = remainingTime;
        this.roundRunningHandlers.startRunner();
    }

    eventHandleList = [
        {
            name: GameServiceMessage.remainingTime,
            handle: this.handleRemainingTime,
        },
    ];
}
