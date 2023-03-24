import { GameSetting } from "./game-setting";
import { RoundTimeStore } from "./round-time/round-time-store";
import { SocketIOStore } from "../socket-io/socket-io-store";
import { injectable, inject } from "inversify";
import { MakeObservableFn, Store } from "../common/store";

@injectable()
export class GameStore implements Store {
  gameRunnerId;

  constructor(
    @inject(SocketIOStore) private socket: SocketIOStore,
    @inject(RoundTimeStore) private roundTimeStore: RoundTimeStore,
    @inject(GameSetting) private gameSetting: GameSetting,
    @inject("makeObservable") makeObservable: MakeObservableFn
  ) {
    makeObservable(this);
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
