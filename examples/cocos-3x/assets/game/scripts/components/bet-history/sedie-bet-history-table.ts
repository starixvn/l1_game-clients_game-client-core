import { _decorator, instantiate, Node } from "cc";
import SedieBetHistoryBodyItem from "./sedie-bet-history-body-item";
import { BetHistoryTable } from "db://shared-components/game/bet-history/scripts/components/bet-history-table";

const { ccclass } = _decorator;

@ccclass("SedieBetHistoryTable")
export class SedieBetHistoryTable extends BetHistoryTable {
    getHistoryItemComponent(node: Node) {
        return node.getComponent(SedieBetHistoryBodyItem);
    }

    buildBodyRow(ticket: any, index: number): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getHistoryItemComponent(bodyRow).setData(ticket, index);
        return bodyRow;
    }
}
