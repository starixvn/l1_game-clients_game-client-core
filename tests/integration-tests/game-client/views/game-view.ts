import { RoundTimeStore } from "../../../../src/core/round-time/round-time-store";
import Observer from "observer";
import { injectable } from "inversify";
import { ViewEngine } from "./view-engine";

const { observer, handle, render } = Observer;

@observer
@injectable()
export class GameView extends ViewEngine {
  gameContent: HTMLElement | null;

  constructor() {
    super();
    this.initView();
  }

  initView() {
    try {
      this.gameContent = document && document?.getElementById("main");
    } catch (error) {
      return null;
    }
  }

  @render(RoundTimeStore, (store) => store.roundTime)
  renderContent(roundTime: string) {
    this.gameContent &&
      (this.gameContent.innerHTML = `Component Render - Round Time - ${roundTime}`);
  }
}
