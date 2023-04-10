import { PlayerStore } from "../../../../../src/players/player-store";
import { GameStore } from "../../../../../src/core/game-store";
import { RoundTimeStore } from "../../../../../src/core/rounds/round-time-store";
import Observer from "observer";
import { injectable } from "inversify";
import { HtmlViewEngine } from "../../views/html-view-engine";
import { RoundStore } from "../../../../../src/core";
import { GameConfigStore } from "../../../../../src/core/game-configs/game-config-store";
import { AuthStore } from "../../../../../src/auth/auth-store";
import { AuthHandlers } from "../../../../../src/auth/auth-handlers";

const { observer, handle, render } = Observer;

@observer("sedie")
@injectable()
export class SedieGameHtmlView extends HtmlViewEngine {
  roundTimeComponent: HTMLElement | null;
  playerComponent: HTMLElement | null;
  gameNameComponent: HTMLElement | null;
  roundStateComponent: HTMLElement | null;
  roundIdComponent: HTMLElement | null;
  oddsComponent: HTMLElement | null;

  constructor() {
    super();
    this.initView();
  }

  onLoad(): void {
    this.sso();
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
      this.oddsComponent = document && document?.getElementById("sedie-odds");
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

  @render(GameConfigStore, (store) => store.odds)
  renderGameConfig(odds: any) {
    this.setInnerHtml(this.oddsComponent, JSON.stringify(odds));
  }

  @render(AuthStore, (store) => store.isAuthenticated)
  logAuthentication(isAuthenticated: any) {
    console.log("sedie game", { isAuthenticated });
    if (isAuthenticated) {
      this.authorize();
    }
  }

  @handle(AuthHandlers.SSO)
  sso() {
    return { token: "player-token", system: 1 };
  }

  @handle(AuthHandlers.Authorize)
  authorize() {}

  private setInnerHtml(component: HTMLElement | null, data: string) {
    component && (component.innerHTML = data);
  }
}
