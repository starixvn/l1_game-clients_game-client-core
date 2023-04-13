import Observer from "observer";
import GameClient from "game-client-base";
import { Component, Label, _decorator } from "cc";

const { Player, Game } = GameClient;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

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

    @render(GameClient.Game.ConnectionStore, (store) => store.signedIn)
    onSignedIn() {
        this.inGame();
    }

    @handle(GameClient.Game.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(Game.RoundTimeStore, (store) => store.roundTime)
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

    @render(Game.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: number) {
        this.updateLabelValue(this.roundId, roundId.toString());
    }

    @render(Game.RoundTimeStore, (store) => store.roundState)
    renderRoundState(state: string) {
        this.updateLabelValue(this.roundState, state);
    }

    updateLabelValue(label: Label, value: string) {
        if (label) {
            label.string = `${label.node.name}: ${value}`;
        }
    }
}
