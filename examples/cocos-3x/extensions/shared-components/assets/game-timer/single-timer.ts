import { _decorator, Component, Label } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

const { Rounds } = GameClient;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass()
export class SingleTimer extends Component {
    @property({ type: Label })
    singleLabel: Label = null;

    @render(RoundTimeStore, (store) => store.countdownTimer)
    setTime(time: number) {
        this.singleLabel.string = time.toString().padStart(2, "0");
    }
}
