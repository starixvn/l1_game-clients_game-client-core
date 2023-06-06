import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame } from "cc";
import Observer from "observer";

import { settings } from "../sedie-settings";
import { getStringDate, getStringDateByTime, getStringHourByTime } from "./date-time-helper";
import { numberWithCommas } from "./number-helper";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;
const { property } = _decorator;

@ccclass
// @observer(settings.name)
export default class SedieBetHistoryItem extends Component {
    @property(Label)
    time: Label | null = null;

    @property(Label)
    round: Label | null = null;

    @property(Label)
    win: Label | null = null;

    @property(Node)
    bg: Node | null = null;

    @property(Sprite)
    kqSprite: Sprite | null = null;

    @property(Label)
    kqLabel: Label | null = null;

    @property(Label)
    date: Label | null = null;

    @property(Label)
    hour: Label | null = null;

    @property(Label)
    odd: Label | null = null;

    @property(Label)
    even: Label | null = null;

    @property(Label)
    red2: Label | null = null;

    @property(Label)
    red3: Label | null = null;

    @property(Label)
    red4: Label | null = null;

    @property(Label)
    white3: Label | null = null;

    @property(Label)
    white4: Label | null = null;

    @property(SpriteFrame)
    iconRed: SpriteFrame = null;

    @property(SpriteFrame)
    iconWhite: SpriteFrame = null;

    setData(data: any, index: number) {
        this.bg.active = index % 2 > 0;
        const { time, phien, result, betwin, win, freeBet, settlementResult } = data;

        if (this.time && this.time.node.children.length === 0) {
            this.time.string = getStringDateByTime(time);
            // this.time.node.color = win ? Color.YELLOW : Color.WHITE;
        } else if (this.date && this.hour) {
            this.date.string = getStringDate(time);
            this.hour.string = getStringHourByTime(time);
        }
        this.round.string = phien;

        let number = 0;
        Object.keys(result).forEach((key) => {
            if (result[key]) {
                number++;
            }
        });

        this.kqLabel.string = number.toString();
        if (number % 2) {
            this.kqSprite.spriteFrame = this.iconRed;
            // this.kqLabel.node.color = Color.WHITE;
        } else {
            this.kqSprite.spriteFrame = this.iconWhite;
            // this.kqLabel.node.color = Color.BLACK;
        }

        this.win.string = numberWithCommas(betwin, 2);

        Object.keys(settlementResult).forEach((choice) => {
            const historyItem = this[choice];
            historyItem.string = freeBet ? 0 : numberWithCommas(data[choice]);

            if (settlementResult[choice]) {
                historyItem.node.color = Color.YELLOW;
            } else {
                historyItem.node.color = Color.WHITE;
            }
        });
    }
}
