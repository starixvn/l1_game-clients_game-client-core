import { inject, injectable } from "inversify";
import { GameSetting } from "../..//game/game-configs";
import { RoundTimeStore, TURN_ROUND_STATE } from "./round-time-store";
import { RoundStore } from "./round-store";
import { GameServiceMessage } from "../../shared";

@injectable()
export class RoundRunningHandlers {
    runnerId;

    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting
    ) { }

    startRunner() {
        this.runnerId = setInterval(() => {
            this.roundTimeStore.countdown();
            if (this.roundTimeStore.roundState === TURN_ROUND_STATE.SWITCH_ROUND) {
                console.log(`this.roundStore.RoundData.balls = []`);
                const clonedRoundData: GameServiceMessage.TurnBaseGameRoundData = {
                    balls: [],
                    drawId: this.roundStore.RoundData.drawId
                };
                this.roundStore.RoundData = clonedRoundData;
            }
        }, 1000);
    }

    stopRunner() {
        clearInterval(this.runnerId);
        this.roundTimeStore.resetRoundTimeStore();
    }
}
