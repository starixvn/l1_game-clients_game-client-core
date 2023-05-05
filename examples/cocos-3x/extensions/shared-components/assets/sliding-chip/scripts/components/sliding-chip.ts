import gc from "game-client-base";
import Observer from "observer";
import {
    AudioSource,
    Component,
    Node,
    Prefab,
    SpriteAtlas,
    SpriteFrame,
    Tween,
    _decorator,
    instantiate,
} from "cc";
import Chip from "./chip";
import { SnapScrollView } from "./snap-scroll-view";

const { observer, render, handle } = Observer;
const { Chips } = gc;

type OnChangedBet = (bet: string) => void;

const { ccclass, property } = _decorator;
@ccclass
export default class SlidingChip extends Component {
    @property(Node)
    chips: Node = null;

    @property(AudioSource)
    singleChipAudio: AudioSource = null;

    @property(AudioSource)
    multiChipAudio: AudioSource = null;

    @property(AudioSource)
    betChipClickAudio: AudioSource = null;

    @property(SpriteAtlas)
    chipAltas: SpriteAtlas = null;

    @property(SnapScrollView)
    snappedScrollView: SnapScrollView = null;

    @property(Node)
    leftButton: Node = null;

    @property(Node)
    rightButton: Node = null;

    @property
    displaySize = 6;

    @property
    movingStep = 1;

    @property(Prefab)
    chipPrefab: Prefab = null;

    @property(SpriteFrame)
    lowValueChipSprite: SpriteFrame = null;

    public gameConfigs: any;
    public chipValues: number[] = [];
    public configValues: number[] = [];
    public onChanged: OnChangedBet = (bet) => {};
    public readonly chipFlyingTime: number = 0.8;
    public readonly loginUserChipFlyingTime: number = 0.5;
    public readonly chipDelayFlyingTime: number = 1.25;
    public smallChipScale = 0.29;

    public enableStakeLevel = true;

    public selectedIndex = 0;
    public chipList: Node[] = [];

    private currentBetValue = "1";
    private disabledBetChips = false;
    protected needResetCurrentChip = true;

    onLoad() {
        this.setLeftButtonStatus(false);
        this.snappedScrollView.onScrollEnded = () => {
            const min = this.snappedScrollView.getMinDisplayIndex();

            if (this.selectedIndex < min) {
                this.selectedIndex = min;
                this.selectedIndex = Math.min(this.selectedIndex, this.chipList.length - this.displaySize);
            } else if (this.selectedIndex > min + this.displaySize - 1) {
                this.selectedIndex = min + this.displaySize - 1;
            }

            this.updateArrowVisibility();
            this.updateSelectedChip();
        };
    }

    protected setLeftButtonStatus(status: boolean) {
        this.leftButton.active = status && !this.disabledBetChips;
    }

    private updateArrowVisibility() {
        this.setLeftButtonStatus(true);
        this.setRightButtonStatus(true);

        if (this.selectedIndex <= 0) {
            this.selectedIndex = 0;
            this.setLeftButtonStatus(false);
        } else if (this.selectedIndex >= this.chipList.length - 1) {
            this.selectedIndex = this.chipList.length - 1;
            this.setRightButtonStatus(false);
        }
    }

    private updateSelectedChip() {
        if (this.chipList.length === 0) {
            return;
        }
        const item = this.chipList[this.selectedIndex].name;
        if (item) {
            this.setCurrentBet(item);
        }
    }

    public setCurrentBet(bet: string) {
        this.currentBetValue = bet;
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    protected updateSelectedBet(targetName: string) {
        this.chips.children.forEach((chip) => {
            Tween.stopAllByTarget(chip);
            const highlight = chip.name === targetName;
            this.highlightChip(chip, highlight);
        });
    }

    protected setRightButtonStatus(status: boolean) {
        this.rightButton.active = status && !this.disabledBetChips;
    }

    public onPrevious() {
        // AudioManager.getInstance().playClick();
        this.selectedIndex -= this.movingStep;
        this.scrollToSelectedIndex();
    }

    public onNext() {
        // AudioManager.getInstance().playClick();
        this.selectedIndex += this.movingStep;
        this.scrollToSelectedIndex();
    }

    private scrollToSelectedIndex() {
        this.updateArrowVisibility();

        const min = this.snappedScrollView.getMinDisplayIndex();
        if (this.selectedIndex <= min) {
            this.snappedScrollView.scrollTo(this.selectedIndex);
        } else if (this.selectedIndex >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(this.selectedIndex - this.displaySize + 2);
        }
        this.updateSelectedChip();
    }

    public createBigChip(value: number): Node {
        const chipNode = instantiate(this.chipPrefab);
        const chip = chipNode.getComponent(Chip);
        chip.setColor(this.chipConfig.getChipColor(value));
        chip.setValue(value);
        const index = this.chipValues.findIndex((chipValue) => chipValue === value);
        chip.setType(this.getChipDisplayType(index));
        return chipNode;
    }

    private getChipDisplayType(index: number) {
        return index > this.chipValues.length - 3 ? Chips.ChipDisplayType.VIP : Chips.ChipDisplayType.Normal;
    }

    setChipValues() {}
    updateChips() {}
    createChips() {}

    createSmallChip() {}
    clearAllHighlight() {}
    highlightChip() {}
    createChipNodes() {}
    showChipOwnBet() {}
}
