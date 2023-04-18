import { Component, Label, _decorator } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";
import { settings } from "./sedie-settings";

const { Player, Rounds, GameConfigs, Connection } = GameClient;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
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

    @property(Label)
    minMaxBet: Label = null;

    @property(Label)
    odds: Label = null;

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderRoundTime(roundTime: number) {
        this.updateLabelValue(this.roundTime, roundTime.toString());
    }

    @render(Player.PlayerStore, (store) => store.name)
    renderPlayer(player: string) {
        this.updateLabelValue(this.player, player);
    }

    @render(GameConfigs.GameSetting, (store) => store.name)
    renderGameName(gameName: string) {
        this.updateLabelValue(this.gameName, gameName);
    }

    @render(Rounds.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: number) {
        this.updateLabelValue(this.roundId, roundId.toString());
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(state: string) {
        this.updateLabelValue(this.roundState, state);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }) {
        this.updateLabelValue(this.minMaxBet, `min: ${minBet} max: ${maxBet}`);
    }

    @render(GameConfigs.GameConfigStore, (store) => store.odds)
    renderOdds(odds: any) {
        this.updateLabelValue(this.odds, JSON.stringify(odds));
    }

    updateLabelValue(label: Label, value: string) {
        if (label) {
            label.string = `${label.node.name}: ${value}`;
        }
    }
}
