import { inject, injectable } from "inversify";
import { GameSetting } from "../..//game/game-configs";
import { RoundTimeStore, TURN_ROUND_STATE } from "./round-time-store";
import { RoundStore } from "./round-store";
import { RoundRunningHandlers as RoundRunningHandlersBase } from "../../game/rounds";

@injectable()
export class RoundRunningHandlers extends RoundRunningHandlersBase {
    runnerId;

    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(RoundStore) protected readonly roundStore: RoundStore
    ) {
        super(roundTimeStore, gameSetting);
    }

    startRunner() {
        this.runnerId = setInterval(() => {
            this.roundTimeStore.countdown();
            if (this.roundTimeStore.roundState === TURN_ROUND_STATE.SWITCH_ROUND) {
                this.roundStore.setRoundData({
                    balls: [],
                    drawId: this.roundStore.roundData.drawId
                });
            }
        }, 1000);
    }
}
