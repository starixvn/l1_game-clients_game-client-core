import { _decorator, Color, Component, Label, Node, tween, UIRenderer, v3 } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

const { Rounds } = GameClient;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass()
export default class TwoDigitsTimer extends Component {
    @property(Label)
    digit_1: Label = null;

    @property(Label)
    digit_2: Label = null;

    @property
    heightOffset: number = 0;

    @property
    animated = true;

    protected readonly lockingColor: Color = Color.RED;
    protected readonly normalColor: Color = Color.WHITE;

    setTime(time: number) {
        const text = `${time}`.padStart(2, "0");
        const firstTimeChar = text.slice(0, 1);
        const secondTimeChar = text.slice(1, 2);

        if (this.digit_1.string !== firstTimeChar) {
            this.handleBetTimeAnimation(this.digit_1.node);
        }

        if (this.digit_2.string !== secondTimeChar) {
            this.handleBetTimeAnimation(this.digit_2.node);
        }

        this.digit_1.string = firstTimeChar;
        this.digit_2.string = secondTimeChar;
    }

    protected setColor(color: Color) {
        this.digit_1.getComponent(UIRenderer).color = color;
        this.digit_2.getComponent(UIRenderer).color = color;
    }

    protected handleBetTimeAnimation(node: Node) {
        if (this.animated) {
            tween(node)
                .to(0, {
                    position: v3(node.position.x, this.heightOffset),
                })
                .to(0.3, {
                    position: v3(node.position.x, 0),
                })
                .start();
        }
    }
    setState(state: string) {
        switch (state) {
            case Rounds.ROUND_STATE.BEGIN_LOCKING_BET:
            case Rounds.ROUND_STATE.LOCKING_BET:
                this.setColor(this.lockingColor);
                break;
            default:
                this.setColor(this.normalColor);
                break;
        }
    }
}
