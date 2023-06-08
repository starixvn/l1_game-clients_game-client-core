import { _decorator, instantiate, Node } from "cc";
import { BetHistoryContainer } from "db://shared-components/bet-history/scripts/components/bet-history-container";
import SedieBetHistoryBodyItem from "./sedie-bet-history-body-item";

const { ccclass } = _decorator;

@ccclass("BetHistoryContainer")
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
