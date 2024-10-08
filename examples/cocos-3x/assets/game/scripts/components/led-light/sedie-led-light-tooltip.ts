import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";
const { ccclass, property } = _decorator;

const {Translator} = gc;

enum TKeyTranslate {
    odd = "glossary_odd",
    event = "glossary_even",
}

@ccclass("SeDieLedLightTooltip")
export abstract class SeDieLedLightTooltip extends LedLightTooltip {
    @property(Label)
    red: Label = null;

    @property(Label)
    white: Label = null;

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        this.roundId.string = `#${ledLightInfo.roundId}`;
        let red = 0;
        Object.values(ledLightInfo.result).forEach((result) => {
            if (result) {
                red++;
            }
        });
        const key = Translator.gameTranslate(red % 2 === 0 ? TKeyTranslate.event : TKeyTranslate.odd);
        this.result.string = key;
        this.red.string = red.toString();
        this.white.string = (4 - red).toString();

        this.showTooltip();
    }
}
