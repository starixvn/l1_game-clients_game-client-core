import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameSetting } from "../game-configs";
import { RoundTimeStore } from "./round-time-store";

@injectable()
export class RoundRunningHandlers implements IMultipleHandlers {
    runnerId;

    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting
    ) {}

    startRunner() {
        this.stopRunner();
        this.runnerId = setInterval(() => {
            this.roundTimeStore.countdown();
        }, 1000);
    }

    stopRunner() {
        clearInterval(this.runnerId);
        this.roundTimeStore.resetRoundTimeStore();
    }

    eventHandleList = [
        {
            name: GameServiceMessage.toGame,
            handle: this.handleToGame,
        },
    ];

    handleToGame(toGame: string) {
        if (toGame && toGame.toLocaleLowerCase() === this.gameSetting.name.toLocaleLowerCase()) {
            this.startRunner();
        }
    }
}
