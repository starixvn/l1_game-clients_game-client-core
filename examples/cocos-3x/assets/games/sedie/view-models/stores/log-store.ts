import GameClient from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class LogStore {
    @inject(GameClient.Game.GameSetting)
    protected readonly gameSetting: GameClient.Game.GameSetting;

    @inject(GameClient.Game.RoundStore)
    protected readonly roundStore: GameClient.Game.RoundStore;

    @inject(GameClient.Game.RoundTimeStore)
    protected readonly roundTimeStore: GameClient.Game.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get message() {
        if (!this.gameSetting || !this.roundStore || !this.roundTimeStore) {
            return "";
        }

        return `${this.gameSetting?.name}: RoundId: ${this.roundStore?.roundId} Round Time: ${this.roundTimeStore?._roundTime}, Begin State: ${this.roundTimeStore?._beginState}`;
    }
}
