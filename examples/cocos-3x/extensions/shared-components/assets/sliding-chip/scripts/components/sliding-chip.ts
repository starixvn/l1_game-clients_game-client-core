import {
    AudioSource,
    Color,
    Component,
    Layout,
    Node,
    Prefab,
    SpriteAtlas,
    SpriteFrame,
    Tween,
    UITransform,
    Vec3,
    _decorator,
    instantiate,
    tween,
    v3,
} from "cc";
import gc from "game-client-base";
import * as _ from "lodash";
import Observer from "observer";
import Chip, { ChipDisplayType } from "./chip";
import { SnapScrollView } from "./snap-scroll-view";

const { observer, render, handle } = Observer;
const { Chips, GameConfigs } = gc;

type OnChangedBet = (bet: string) => void;

const { ccclass, property } = _decorator;

@ccclass
@observer("SeDie")
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

    public chipValues: number[] = [];
    public readonly chipFlyingTime: number = 0.8;
    public readonly loginUserChipFlyingTime: number = 0.5;
    public readonly chipDelayFlyingTime: number = 1.25;
    public smallChipScale = 0.29;
    public enableStakeLevel = true;
    public chipList: Node[] = [];

    private disabledBetChips = false;
    protected chipSetting: gc.Chips.TChipSetting;

    @handle(Chips.SlidingChipHandler.OnLoad)
    onLoad() {
        this.snappedScrollView.actionScrollEnded = () => {
            this.updateSelectChip();
            this.updateArrowVisibility();
        };
    }

    @handle(Chips.SlidingChipHandler.UpdateSelectChip)
    updateSelectChip() {
        return {
            displayMin: this.snappedScrollView.getMinDisplay(),
            displaySize: this.displaySize,
        };
    }

    @handle(Chips.SlidingChipHandler.UpdateArrowVisibility)
    private updateArrowVisibility() {
        return { chipListLength: this.chipList.length };
    }

    @render(GameConfigs.GameConfigStore, (store) => store.chips)
    setChipValues(chips: number[]) {
        console.log("chipschips-----------", chips.toString());
        chips && this.updateChipsValue();
    }

    @handle(Chips.SlidingChipHandler.UpdateCurrentBet)
    updateCurrentBet(bet: string) {
        return { bet };
    }

    @render(Chips.SlidingChipStore, (store) => store.scrollState)
    snapScrollEnd(scrollState: string) {
        if (scrollState === gc.Chips.SCROLL_STATE.SCROLL_ENDED) {
            this.updateSelectChip();
            this.updateArrowVisibility();
        }
    }

    @render(Chips.SlidingChipStore, (store) => store.isShowLeftArrow)
    protected setLeftButtonStatus(isShowLeftArrow: boolean) {
        this.leftButton.active = isShowLeftArrow && !this.disabledBetChips;
    }

    @render(Chips.SlidingChipStore, (store) => store.isShowRightArrow)
    protected setRightButtonStatus(isShowRightArrow: boolean) {
        this.rightButton.active = isShowRightArrow && !this.disabledBetChips;
    }

    @render(Chips.SlidingChipStore, (store) => store.currentBet)
    public setCurrentBet(currentBet: string) {
        this.updateSelectedBet(currentBet);
    }

    protected updateSelectedBet(targetName: string) {
        this.chips.children.forEach((chip) => {
            Tween.stopAllByTarget(chip);
            const highlight = chip.name === targetName;
            this.highlightChip(chip, highlight);
        });
    }

    protected highlightChip(chip: Node, highlight: boolean) {
        const activeNode = chip.getChildByName("active");
        activeNode.active = highlight;
        chip.getComponent(UITransform).priority = highlight ? 2 : 1;
        const scaleChip = highlight ? 1.15 : 1;
        const posY = highlight ? 12 : 0;
        tween(chip)
            .to(0.2, {
                scale: v3(scaleChip),
                position: v3(chip.position.x, posY),
            })
            .start();
    }

    @handle(Chips.SlidingChipHandler.ClickPrev)
    public onPrevious() {
        // AudioManager.getInstance().playClick();
        return { chipMovingStep: this.movingStep };
    }

    @handle(Chips.SlidingChipHandler.ClickNext)
    public onNext() {
        // AudioManager.getInstance().playClick();

        return { chipMovingStep: this.movingStep };
    }

    @render(Chips.SlidingChipStore, (store) => store.selectChip)
    scrollToSelectedIndex(selectChip: number) {
        this.updateArrowVisibility();

        const min = this.snappedScrollView.getMinDisplay();
        if (selectChip <= min) {
            this.snappedScrollView.scrollTo(selectChip);
        } else if (selectChip >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(selectChip - this.displaySize + 2);
        }

        this.handleBet(selectChip);
    }

    private handleBet(selectChip: number) {
        if (this.chipList.length === 0) {
            return;
        }
        const bet = this.chipList[selectChip].name;
        if (bet) {
            this.updateCurrentBet(bet);
        }
    }

    private getChipDisplayType(index: number) {
        return index > this.chipValues.length - 3 ? ChipDisplayType.VIP : ChipDisplayType.Normal;
    }

    @render(Chips.ChipSettingStore, (store) => store.chipSetting)
    updateChipSetting(chipSetting: gc.Chips.TChipSetting) {
        this.chipSetting = chipSetting;
    }

    getChipColor(value: number): Color {
        const hexStr = this.chipSetting[value];
        let color: Color = new Color(0, 0, 0, 255);
        if (!hexStr) {
            console.error(`Missing color for chip ${value}`);
            Color.fromHEX(color, this.chipSetting[0]);
            return color;
        }

        Color.fromHEX(color, hexStr);
        return color;
    }

    @handle(Chips.SlidingChipHandler.CreateChips)
    createChips() {
        this.chipList.forEach((chip) => chip.destroy());
        this.chips.removeAllChildren();
        this.chipList = [];
        this.chipValues.forEach((value) => {
            const node = this.createChipNode(value);
            this.chips.addChild(node);
            node.on("click", this.onClickBet.bind(this));
            this.chipList.push(node);
        });

        const layout = this.chips.getComponent(Layout);
        layout.enabled = true;
        layout.updateLayout();
        layout.enabled = false;

        return { chipsLength: this.chipList.length };
    }

    createChipNode(value: number): Node {
        return this.createBigChip(value);
    }

    protected createBigChip(value: number): Node {
        const chipNode = instantiate(this.chipPrefab);
        const chip = chipNode.getComponent(Chip);
        chip.setColor(this.getChipColor(value));
        chip.setValue(value);
        const index = this.chipValues.findIndex((chipValue) => chipValue === value);
        chip.setType(this.getChipDisplayType(index));
        return chipNode;
    }

    public onClickBet(target: Component) {
        const bet = target.node.name;
        // AudioManager.getInstance().playSFX(this.betChipClickAudio.clip);
        this.setSelectChipAndScroll(bet);
    }

    @handle(Chips.SlidingChipHandler.SetSelectChipAndScroll)
    protected setSelectChipAndScroll(bet: string) {
        let index = 0;
        for (; index < this.chipList.length; index++) {
            if (this.chipList[index].name === bet) {
                break;
            }
        }

        return { selectedChip: index };
    }

    @handle(Chips.SlidingChipHandler.UpdateChipsValue)
    updateChipsValue() {}

    @render(Chips.SlidingChipStore, (store) => store.isResetScrollViewOffset)
    needResetScrollViewOffset() {
        this.snappedScrollView.scrollView.scrollToPercentHorizontal(0, 0.1, true);
    }

    createSmallChip() {}
    // payChipsToWinningBetItemWithAmount(){}
    // createChipNodes(){}

    public getRandomPositionChip(chip: Node, box: Node): Vec3 {
        const chipBoundingBox = chip.getComponent(UITransform).getBoundingBox();
        const xDest = _.random(
            Math.floor(chip.getComponent(UITransform).width / 4),
            Math.floor(box.getComponent(UITransform).width - chipBoundingBox.width / 2) + 1
        );
        const yDest = _.random(
            Math.floor(chip.getComponent(UITransform).height / 4),
            Math.floor(box.getComponent(UITransform).height - chipBoundingBox.height / 2) + 1
        );
        return v3(xDest, yDest);
    }

    @render(Chips.SlidingChipStore, (store) => store.chipValues)
    updateChipValues(chipValues: number[]) {
        console.log("chipValues---------", chipValues);
        this.chipValues = chipValues;
        this.createChips();
        this.updateChips();
    }

    @handle(Chips.SlidingChipHandler.UpdateChips)
    updateChips() {}
}
