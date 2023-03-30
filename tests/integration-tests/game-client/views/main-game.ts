import { PlayerStore } from "./../../../../src/players/player-store";
import { GameStore } from "./../../../../src/core/game-store";
import { RoundTimeStore } from "../../../../src/core/round-time/round-time-store";
import Observer from "observer";
import { injectable } from "inversify";
import { ViewEngine } from "./view-engine";

const { observer, handle, render } = Observer;

@observer
@injectable()
export class MainGame extends ViewEngine {
  roundTimeComponent: HTMLElement | null;
  playerComponent: HTMLElement | null;
  gameNameComponent: HTMLElement | null;
  roundStateComponent: HTMLElement | null;

  constructor() {
    super();
    this.initView();
  }

  initView() {
    try {
      this.roundTimeComponent =
        document && document?.getElementById("round-time");
      this.playerComponent = document && document?.getElementById("player");
      this.gameNameComponent =
        document && document?.getElementById("game-name");
      this.roundStateComponent =
        document && document?.getElementById("round-state");
    } catch (error) {
      return null;
    }
  }

  @render(GameStore, (store) => store.gameName)
  renderGameName(gameName: string) {
    this.setInnerHtml(this.gameNameComponent, gameName);
  }

  @render(PlayerStore, (store) => store.name)
  renderPlayer(playerName: string) {
    this.setInnerHtml(this.playerComponent, playerName);
  }

  @render(RoundTimeStore, (store) => store.roundTime)
  renderRoundTime(roundTime: string) {
    this.setInnerHtml(this.roundTimeComponent, roundTime);
  }

  @render(RoundTimeStore, (store) => store.roundState)
  renderRoundState(roundState: string) {
    this.setInnerHtml(this.roundStateComponent, roundState);
  }

  private setInnerHtml(component: HTMLElement | null, data: string) {
    component && (component.innerHTML = data);
  }
}
