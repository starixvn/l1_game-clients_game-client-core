import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { WarningCmp } from "./warning-cmp";

const { observer, render, handle } = Observer;

const { Notice } = gc;
const { ccclass, property } = _decorator;

@ccclass("WarningContainer")
@observer("SeDie")
export class WarningContainer extends NodeContainer {
    @render(Notice.NoticeStore, (store) => store.warning, { fireImmediately: false })
    showWarning(warning) {
        if (warning.message) {
            const node = this.createNode();
            const warningCmp = node.getComponent(WarningCmp);
            warningCmp.setData(warning.message);
        }
    }
}
