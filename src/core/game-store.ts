import { RoundTimeStore } from "./round-time/round-time-store";
import { SocketIOStore } from "../socket-io/socket-io-store";
import { injectable, inject } from "inversify";
import { MakeObservableFn, Store } from "../common/store";
import { clearInterval } from "timers";

// export enum GameState {
//   None = 0,
//   Started,
//   Stopped,
//   Disabled,
//   InActivated,
//   Activated,
// }

@injectable()
export class GameStore implements Store {
  gameRunnerId;
  _gameName: string;

  constructor(
    @inject(SocketIOStore) private socket: SocketIOStore,
    @inject(RoundTimeStore) private roundTimeStore: RoundTimeStore,
    @inject("makeObservable") makeObservable: MakeObservableFn
  ) {
    makeObservable(this);
  }

  set gameName(gameName: string) {
    this._gameName = gameName;
  }

  get gameName() {
    return this._gameName;
  }

  startGame() {
    this.stopGame();
    this.gameRunnerId = setInterval(() => {
      this.roundTimeStore.countdown();
    }, 1000);
  }

  stopGame() {
    clearInterval(this.gameRunnerId);
  }
}
