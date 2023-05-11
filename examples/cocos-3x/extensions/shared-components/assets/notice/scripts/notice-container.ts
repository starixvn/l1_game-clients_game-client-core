import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { NoticeCmp } from "./notice-cmp";

const { observer, render, handle } = Observer;

const { Notice } = gc;
const { ccclass, property } = _decorator;

@ccclass("NoticeContainer")
export class NoticeContainer extends NodeContainer {
    @render(Notice.NoticeStore, (store) => store.notice, { fireImmediately: false })
    showNotice(notice: gc.Notice.Notice) {
        const node = this.createNode();
        const noticeCmp = node.getComponent(NoticeCmp);
        noticeCmp.setData(notice);
    }
}
