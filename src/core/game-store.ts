import { GameSetting } from "./game-setting";
import { RoundTimeStore } from "./rounds/round-time-store";
import { SocketIOStore } from "../socket-io/socket-io-store";
import { injectable, inject } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class GameStore {
  gameRunnerId;

  constructor(
    @inject(SocketIOStore) private socket: SocketIOStore,
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
    if (
      gameName &&
      gameName.toLocaleLowerCase() === this.gameSetting.name.toLocaleLowerCase()
    ) {
      this.startGameRunner();
    }
  }

  stopGameRunner() {
    clearInterval(this.gameRunnerId);
  }
}
