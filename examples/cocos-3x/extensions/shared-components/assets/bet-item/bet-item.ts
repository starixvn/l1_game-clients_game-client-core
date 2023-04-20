import { _decorator, Component, Label } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

const { observer, render, handle } = Observer;

const { Rounds, GameConfigs } = GameClient;

const { ccclass, property } = _decorator;

export default class BetItem extends Component {
    @property(Label)
    ownBet: Label = null;

    @property(Label)
    totalBet: Label = null;

    @property(Label)
    odds: Label = null;

    onLoad() {
        this.ownBet.string = "";
        this.totalBet.string = "";
        this.odds.string = "";
    }

    @render(GameConfigs.GameConfigStore, (store) => store.odds)
    renderOdds(odds: any) {
        const choice = this.node.name;
        if (odds[choice]) {
            this.odds.string = `${odds[choice] - 1}:1`;
        }
    }

    @render(Rounds.RoundStore, (store) => store.ownBets)
    renderOwnBets(data: any) {
        const choice = this.node.name;
        if (data[choice]) {
            this.ownBet.string = `${data[choice]}`;
        }
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(data: any) {
        const choice = this.node.name;
        if (data[choice]) {
            this.totalBet.string = `${data[choice]}`;
        }
    }
}
