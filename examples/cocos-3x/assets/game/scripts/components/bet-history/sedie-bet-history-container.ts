import { _decorator, instantiate, Node } from "cc";
import { BetHistoryContainer } from "db://shared-components/game/bet-history/scripts/components/bet-history-container";
import SedieBetHistoryBodyItem from "./sedie-bet-history-body-item";
import Observer from "observer";
import { settings } from "../../sedie-settings";
const { ccclass } = _decorator;
const { observer } = Observer;

@ccclass("BetHistoryContainer")
@observer(settings.name)
export class SedieBetHistoryContainer extends BetHistoryContainer {
    getHistoryItemComponent(node: Node) {
        return node.getComponent(SedieBetHistoryBodyItem);
    }

    buildBodyRow(ticket: any, index: number): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getHistoryItemComponent(bodyRow).setData(ticket, index);
        return bodyRow;
    }
}
