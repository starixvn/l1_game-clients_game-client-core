import GameClient from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class LogStore {
  @inject(GameClient.Core.GameSetting)
  protected readonly gameSetting: GameClient.Core.GameSetting;

  @inject(GameClient.Core.RoundStore)
  protected readonly roundStore: GameClient.Core.RoundStore;

  @inject(GameClient.Core.RoundTimeStore)
  protected readonly roundTimeStore: GameClient.Core.RoundTimeStore;

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
