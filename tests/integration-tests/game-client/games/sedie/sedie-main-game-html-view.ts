import { PlayerStore } from "../../../../../src/players/player-store";
import { GameStore } from "../../../../../src/core/game-store";
import { RoundTimeStore } from "../../../../../src/core/rounds/round-time-store";
import Observer from "observer";
import { injectable } from "inversify";
import { HtmlViewEngine } from "../../views/html-view-engine";
import { RoundStore } from "../../../../../src/core";

const { observer, handle, render } = Observer;

@observer
@injectable()
export class SedieGameHtmlView extends HtmlViewEngine {
  roundTimeComponent: HTMLElement | null;
  playerComponent: HTMLElement | null;
  gameNameComponent: HTMLElement | null;
  roundStateComponent: HTMLElement | null;
  roundIdComponent: HTMLElement | null;

  constructor() {
    super();
    this.initView();
  }

  initView() {
    try {
      this.roundTimeComponent =
        document && document?.getElementById("sedie-round-time");
      this.playerComponent =
        document && document?.getElementById("sedie-player");
      this.gameNameComponent =
        document && document?.getElementById("sedie-game-name");
      this.roundStateComponent =
        document && document?.getElementById("sedie-round-state");
      this.roundIdComponent =
        document && document?.getElementById("sedie-round-id");
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

  @render(RoundStore, (store) => store.roundId)
  renderRoundId(roundId: string) {
    this.setInnerHtml(this.roundIdComponent, roundId);
  }

  private setInnerHtml(component: HTMLElement | null, data: string) {
    component && (component.innerHTML = data);
  }
}
