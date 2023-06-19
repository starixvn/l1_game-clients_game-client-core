import { _decorator, Color, Label, Node, Sprite, SpriteFrame } from "cc";
import { DateTimeUtils } from "db://shared-components/shared/utils/date-time-utils";
import { NumberUtils } from "db://shared-components/shared/utils/number-utils";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass } = _decorator;
const { property } = _decorator;

@ccclass
export default class SedieBetHistoryBodyItem extends ObserverComponent {
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
            this.time.string = DateTimeUtils.getStringDateByTime(time);
            this.time.color = win ? Color.YELLOW : Color.WHITE;
        } else if (this.date && this.hour) {
            this.date.string = DateTimeUtils.getStringDate(time);
            this.hour.string = DateTimeUtils.getStringHourByTime(time);
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
            this.kqLabel.color = Color.WHITE;
        } else {
            this.kqSprite.spriteFrame = this.iconWhite;
            this.kqLabel.color = Color.BLACK;
        }

        this.win.string = NumberUtils.numberWithCommas(betwin, 2);

        Object.keys(settlementResult).forEach((choice) => {
            const historyItem = this[choice];
            historyItem.string = freeBet ? 0 : NumberUtils.numberWithCommas(data[choice]);

            if (settlementResult[choice]) {
                historyItem.node.color = Color.YELLOW;
            } else {
                historyItem.node.color = Color.WHITE;
            }
        });
    }
}
