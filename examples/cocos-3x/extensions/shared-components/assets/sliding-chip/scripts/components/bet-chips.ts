import { Component, Node, Prefab, _decorator, instantiate } from "cc";
import SlidingChip from "./sliding-chip";

const { property } = _decorator;

export default class BetChips extends Component {
    @property(Node)
    betChipsContainer: Node = null;

    @property(Prefab)
    slidingChipPrefab: Prefab = null;

    protected slidingChip: SlidingChip;

    onLoad() {
        this.initBetChips();
    }

    protected initBetChips() {
        if (this.betChipsContainer) {
            const betChipsNode = instantiate(this.slidingChipPrefab);
            this.betChipsContainer.addChild(betChipsNode);
            this.initBetChipByLoader(betChipsNode);
        }
    }

    initBetChipByLoader(node: Node) {
        this.slidingChip = node.getComponent(SlidingChip);
        this.slidingChip.enableStakeLevel = this.isUsingMaxStakeLevel();
    }

    public isUsingMaxStakeLevel() {
        return true;
    }
}
