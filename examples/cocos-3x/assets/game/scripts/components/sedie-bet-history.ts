import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite } from "cc";
import Observer from "observer";
import gc from "game-client-base";
import { settings } from "../sedie-settings";
import { Dialog } from "../../../../extensions/shared-components/assets/dialogs/dialog";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;
const { property } = _decorator;
const { BetHistory } = gc;

@ccclass()
// @observer(settings.name)
export class SedieBetHistory extends Component {
    @property(Prefab)
    ticketDetailPrefab: Prefab = null;

    // @property(PaginationCommon)
    // pagination: PaginationCommon = null;

    @property(Node)
    mainFrame: Node = null;

    @property(Label)
    gameName: Label = null;

    @property(Node)
    content: Node = null;

    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    wrapperContent: Node = null;

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Prefab)
    wrapperPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;
    start() {}

    setData(model: gc.BetHistory.BetHistoryModel) {
        this.content.addChild(instantiate(this.wrapperPrefab));
        const itemNode = instantiate(this.itemPrefab);
        // const item = itemNode.getComponent(WinThreeCardsHistoryItem);
        this.content.addChild(itemNode);
    }

    // onClosed() {
    //     this.hide();
    // }
}
