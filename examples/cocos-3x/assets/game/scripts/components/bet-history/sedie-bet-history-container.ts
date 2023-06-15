import { _decorator, instantiate, Node } from "cc";
import { BetHistoryContainer } from "db://shared-components/game/bet-history/scripts/components/bet-history-container";
import SedieBetHistoryBodyItem from "./sedie-bet-history-body-item";
import Observer from "observer";
import { settings } from "../../sedie-settings";
import { SedieBetHistoryTable } from "./sedie-bet-history-table";
const { ccclass } = _decorator;
const { observer } = Observer;

@ccclass("BetHistoryContainer")
@observer(settings.name)
export class SedieBetHistoryContainer extends BetHistoryContainer {
    getHistoryTableComponent() {
        return this.wrapperNode.getComponentInChildren(SedieBetHistoryTable);
    }
}
