import Observer from "observer";
import GameClient from "game-client-base";
import { Component, Label, _decorator } from "cc";

const { Player, Core } = GameClient;
const { ccclass, property } = _decorator;
const { observer, render } = Observer;

@ccclass
@observer("sedie")
export default class Sedie extends Component {
  @property(Label)
  roundTime: Label = null;

  @property(Label)
  player: Label = null;

  @property(Label)
  gameName: Label = null;

  @property(Label)
  roundId: Label = null;

  @property(Label)
  roundState: Label = null;

  @render(Core.RoundTimeStore, (store) => store.roundTime)
  renderRoundTime(roundTime: number) {
    this.updateLabelValue(this.roundTime, roundTime.toString());
  }

  @render(Player.PlayerStore, (store) => store.name)
  renderPlayer(player: string) {
    this.updateLabelValue(this.player, player);
  }

  @render(Player.PlayerStore, (store) => store.name)
  renderGameName(gameName: string) {
    this.updateLabelValue(this.gameName, gameName);
  }

  @render(Core.RoundStore, (store) => store.roundId)
  renderRoundId(roundId: number) {
    this.updateLabelValue(this.roundId, roundId.toString());
  }

  @render(Core.RoundTimeStore, (store) => store.roundState)
  renderRoundState(state: string) {
    this.updateLabelValue(this.roundState, state);
  }

  updateLabelValue(label: Label, value: string) {
    if (label) {
      label.string = `${label.node.name}: ${value}`;
    }
  }
}
