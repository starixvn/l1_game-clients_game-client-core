import { injectable } from "inversify";
import Observer from "observer";
import { RoundStore } from "../../../../../src/core";
import { GameStore } from "../../../../../src/core/game-store";
import { RoundTimeStore } from "../../../../../src/core/rounds/round-time-store";
import { PlayerStore } from "../../../../../src/players/player-store";
import { HtmlViewEngine } from "../../views/html-view-engine";
import { GameConfigStore } from "../../../../../src/core/game-configs/game-config-store";
import { AuthStore } from "../../../../../src/auth/auth-store";

const { observer, handle, render } = Observer;

@observer("dragonTiger")
@injectable()
export class DragonTigerGameHtmlView extends HtmlViewEngine {
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

  initView() {
    try {
      this.roundTimeComponent =
        document && document?.getElementById("dragon-tiger-round-time");
      this.playerComponent =
        document && document?.getElementById("dragon-tiger-player");
      this.gameNameComponent =
        document && document?.getElementById("dragon-tiger-game-name");
      this.roundStateComponent =
        document && document?.getElementById("dragon-tiger-round-state");
      this.roundIdComponent =
        document && document?.getElementById("dragon-tiger-round-id");
      this.oddsComponent =
        document && document?.getElementById("dragon-tiger-odds");
    } catch (error) {
      //console.log(error);
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
  renderRoundTime(roundTime: number) {
    this.setInnerHtml(this.roundTimeComponent, roundTime?.toString());
  }

  @render(RoundTimeStore, (store) => store.roundState)
  renderRoundState(roundState: string) {
    this.setInnerHtml(this.roundStateComponent, roundState);
  }

  @render(RoundStore, (store) => store.roundId)
  renderRoundId(roundId: number) {
    this.setInnerHtml(this.roundIdComponent, roundId?.toString());
  }

  @render(AuthStore, (store) => store.isAuthenticated)
  logAuthentication(isAuthenticated: any) {
    console.log("dragon tiger game", { isAuthenticated });
  }

  @render(GameConfigStore, (store) => store.odds)
  renderGameConfig(odds: any) {
    this.setInnerHtml(this.oddsComponent, JSON.stringify(odds));
  }

  private setInnerHtml(component: HTMLElement | null, data: string) {
    component && (component.innerHTML = data);
  }
}
