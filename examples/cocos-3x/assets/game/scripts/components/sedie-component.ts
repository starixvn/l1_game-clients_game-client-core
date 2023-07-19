import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../sedie-settings";
import "./../../../resources/i18n";
import { SediePlate } from "./sedie-plate";

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer } = Observer;

@ccclass
@observer(settings.name)
export default class Sedie extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(SediePlate)
    cpnThePlate: SediePlate = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.cpnThePlate.setDots(result);
            this.cpnThePlate.openBowl(hasAnimation);
        }
    }

    handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
            this.cpnThePlate.closeBowl(true);
            this.cpnThePlate.shakePlate();
        }
    }
}
