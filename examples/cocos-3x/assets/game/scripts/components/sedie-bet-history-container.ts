import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { BetHistoryContainer } from "../../../../extensions/shared-components/assets/bet-history/scripts/components/bet-history-container";
import { SedieBetHistoryCmp } from "./sedie-bet-history-cmp";
import { SedieBetHistory } from "./sedie-bet-history";

const { render } = Observer;

const { BetHistory } = gc;
const { ccclass } = _decorator;

@ccclass("BetHistoryContainer")
export class SedieBetHistoryContainer extends BetHistoryContainer {
    @render(BetHistory.BetHistoryStore, (store) => store.data, { fireImmediately: false })
    showBetHistory(model: gc.BetHistory.BetHistoryModel) {
        console.log("open Bet History", model);
        const node = this.createNode();
        const betHistoryCmp = node.getComponent(SedieBetHistoryCmp);
        betHistoryCmp.setData(model);
    }
}
