import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { ConnectionStore } from "./connection";
import { GameSetting } from "./game-configs";
import { RoundTimeStore } from "./rounds";

@injectable()
export class GameStore {
    gameRunnerId;

    constructor(
        @inject(ConnectionStore) private socket: ConnectionStore,
        @inject(RoundTimeStore) private roundTimeStore: RoundTimeStore,
        @inject(GameSetting) private gameSetting: GameSetting
    ) {
        makeAutoObservable(this);
    }

    get gameName() {
        return this.gameSetting.name;
    }

    startGameRunner() {
        this.stopGameRunner();
        this.gameRunnerId = setInterval(() => {
            this.roundTimeStore.countdown();
        }, 1000);
    }

    toGame(gameName: string) {
        if (gameName && gameName.toLocaleLowerCase() === this.gameSetting.name.toLocaleLowerCase()) {
            this.startGameRunner();
        }
    }

    stopGameRunner() {
        clearInterval(this.gameRunnerId);
    }
}
