import { _decorator, instantiate, Label, Node, Prefab, UITransform, Vec3, Widget } from "cc";
const { ccclass, property } = _decorator;
import gc from "game-client-base";
import { BetHistoryCmp } from "../../../../extensions/shared-components/assets/bet-history/scripts/components/bet-history-cmp";
import { Dialog } from "../../../../extensions/shared-components/assets/dialogs/dialog";
import SedieBetHistoryItem from "./sedie-bet-history-item";

@ccclass()
export class SedieBetHistoryCmp extends Dialog {
    @property(Node)
    closedButton: Node = null;

    @property(Node)
    mainBackground: Node = null;

    @property(Node)
    table: Node = null;

    @property(Node)
    header: Node = null;

    @property(Node)
    body: Node = null;

    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    protected start(): void {
        // const table = this.node.getChildByName("table-bg");
        const uiTransform = this.table.getComponent(UITransform);
        this.table.getComponent(UITransform).width = 1300;
        this.mainBackground.getComponent(UITransform).width = 750;

        // const position = this.node.getPosition();
        // this.node.setPosition(new Vec3(position.x + ammount, position.y));

        const widget = this.closedButton.getComponent(Widget);
        widget!.right = widget!.right - 75;
        // const currentPostision = this.closedButton.getPosition();
        // console.log(this.closedButton.getPosition());

        // this.closedButton.setPosition(new Vec3(currentPostision.x + 150, currentPostision.y));
        // console.log(this.closedButton.getPosition());
    }

    setData(data: gc.BetHistory.BetHistoryModel) {
        this.header.addChild(instantiate(this.headerPrefab));

        data.betLogs.forEach((ticket, index) => {
            console.log("SedieBetHistoryCmp setData Body : " + index);
            const row = instantiate(this.bodyPrefab);
            const sedieBetHistoryItem = row.getComponent(SedieBetHistoryItem);
            sedieBetHistoryItem.setData(ticket, index);
            this.body.addChild(row);
        });

        // this.node.addChild(instantiate(this.headerPrefab));
        // this.node.addChild(instantiate(this.bodyPrefab));
    }

    onClosed() {
        this.hide();
    }
}
