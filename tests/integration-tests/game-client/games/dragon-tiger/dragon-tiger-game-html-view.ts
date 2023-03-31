import { PlayerStore } from "../../../../../src/players/player-store";
import { GameStore } from "../../../../../src/core/game-store";
import { RoundTimeStore } from "../../../../../src/core/rounds/round-time-store";
import Observer from "observer";
import { injectable, inject } from "inversify";
import { HtmlViewEngine } from "../../views/html-view-engine";
import { reaction } from "mobx";
import { RoundStore } from "../../../../../src/core";

const { observer, handle, render } = Observer;

@observer
@injectable()
export class DragonTigerGameHtmlView extends HtmlViewEngine {
  roundTimeComponent: HTMLElement | null;
  playerComponent: HTMLElement | null;
  gameNameComponent: HTMLElement | null;
  roundStateComponent: HTMLElement | null;
  roundIdComponent: HTMLElement | null;

  constructor(
    @inject(RoundTimeStore) private roundTimeStore: RoundTimeStore,
    @inject(PlayerStore) private playerStore: PlayerStore,
    @inject(GameStore) private gameStore: GameStore,
    @inject(RoundStore) private roundStore: RoundStore
  ) {
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

      this.registerRenderGameName();
      this.registerRenderPlayer();
      this.registerRenderRoundState();
      this.registerRenderRoundTime();
      this.registerRenderRoundId();
    } catch (error) {
      //console.log(error);
      return null;
    }
  }

  //@render(GameStore, (store) => store.gameName)
  registerRenderGameName() {
    this.setInnerHtml(this.gameNameComponent, this.gameStore.gameName);
    reaction(
      () => this.gameStore.gameName,
      (gameName) => {
        this.setInnerHtml(this.gameNameComponent, gameName);
      }
    );
  }

  //@render(PlayerStore, (store) => store.name)
  registerRenderPlayer() {
    reaction(
      () => this.playerStore.name,
      (playerName) => {
        this.setInnerHtml(this.playerComponent, playerName);
      }
    );
  }

  //@render(RoundTimeStore, (store) => store.roundTime)
  registerRenderRoundTime() {
    reaction(
      () => this.roundTimeStore.roundTime,
      (roundTime) => {
        this.setInnerHtml(this.roundTimeComponent, roundTime?.toString());
      }
    );
  }

  //@render(RoundTimeStore, (store) => store.roundState)
  registerRenderRoundState() {
    reaction(
      () => this.roundTimeStore.roundState,
      (roundState) => {
        this.setInnerHtml(this.roundStateComponent, roundState);
      }
    );
  }

  registerRenderRoundId() {
    reaction(
      () => this.roundStore.roundId,
      (roundId) => {
        this.setInnerHtml(this.roundIdComponent, roundId?.toString());
      }
    );
  }

  private setInnerHtml(component: HTMLElement | null, data: string) {
    component && (component.innerHTML = data);
  }
}
