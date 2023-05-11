import {
    Color,
    Component,
    Layout,
    Node,
    Prefab,
    Sprite,
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
import { random, round } from "lodash-es";
import Observer from "observer";
import { SlidingChipHandler } from "../handlers/sliding-chip-handler";
import { SlidingChipStore, TBetItem } from "../stores/sliding-chip-store";
import Chip, { ChipDisplayType } from "./chip";
import { SnapScrollView } from "./snap-scroll-view";

const { render, handle, useObserver } = Observer;
const { Chips, GameConfigs, Player, Rounds } = gc;

const { ccclass, property } = _decorator;

@ccclass
export default class SlidingChip extends Component {
    @property
    namespace = "game";

    @property(Node)
    chips: Node = null;

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
    dispose: Function;

    setDisabledBetChips(status: boolean) {
        this.disabledBetChips = status;
    }

    @handle(SlidingChipHandler.OnLoad)
    onLoad() {
        this.dispose = useObserver(this, this.namespace);
        this.handleFirstLoad();
    }

    handleFirstLoad() {
        this.setLeftButtonStatus(false);
        this.snappedScrollView.actionScrollEnded = () => {
            this.updateSelectChip();
        };
    }

    protected onDestroy(): void {
        this.dispose();
    }

    @handle(SlidingChipHandler.UpdateSelectChip)
    updateSelectChip() {
        return {
            displayMin: this.snappedScrollView.getMinDisplay(),
            displaySize: this.displaySize,
        };
    }

    private updateArrowVisibility(selectChip: number) {
        this.setLeftButtonStatus(true);
        this.setRightButtonStatus(true);

        if (selectChip <= 0) {
            this.setLeftButtonStatus(false);
        } else if (selectChip >= this.chipList.length - 1) {
            this.setRightButtonStatus(false);
        }
    }

    @render(GameConfigs.GameConfigStore, (store) => store.chips)
    setChipValues(chips: number[]) {
        // init
        chips && this.updateChipsValue();
    }

    @render(Player.PlayerStore, (store) => store.stakeLevel)
    updateUserStaleLevel(stakeLevel: gc.Player.IStakeLevel) {
        stakeLevel && this.updateChipsValue();
    }

    @handle(SlidingChipHandler.UpdateCurrentBet)
    updateCurrentBet(bet: string) {
        return { bet };
    }

    protected setLeftButtonStatus(isShowLeftArrow: boolean) {
        this.leftButton.active = isShowLeftArrow && !this.disabledBetChips;
    }

    protected setRightButtonStatus(isShowRightArrow: boolean) {
        this.rightButton.active = isShowRightArrow && !this.disabledBetChips;
    }

    @render(SlidingChipStore, (store) => store.currentBet)
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
        chip.setSiblingIndex(highlight ? 1 : 0);
        const scaleChip = highlight ? 1.15 : 1;
        const posY = highlight ? 12 : 0;
        tween(chip)
            .to(0.2, {
                scale: v3(scaleChip, scaleChip, scaleChip),
                position: v3(chip.position.x, posY),
            })
            .start();
    }

    @handle(SlidingChipHandler.ClickArrow, (handler, payload: { chipMovingStep: number }) => handler.handlePrev(payload))
    public onPrevious() {
        // Audio Click
        return { chipMovingStep: this.movingStep };
    }

    @handle(SlidingChipHandler.ClickArrow, (handler, payload: { chipMovingStep: number }) => handler.handleNext(payload))
    public onNext() {
        // Audio Click
        return { chipMovingStep: this.movingStep };
    }

    @render(SlidingChipStore, (store) => store.selectChip)
    scrollToSelectedIndex(selectChip: number) {
        this.updateArrowVisibility(selectChip);

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

    @handle(SlidingChipHandler.CreateChips)
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
        // Audio Click
        this.setSelectChipAndScroll(bet);
    }

    @handle(SlidingChipHandler.SetSelectChipAndScroll)
    protected setSelectChipAndScroll(bet: string) {
        let index = 0;
        for (; index < this.chipList.length; index++) {
            if (this.chipList[index].name === bet) {
                break;
            }
        }

        return { selectedChip: index };
    }

    @handle(SlidingChipHandler.UpdateChipsValue)
    updateChipsValue() {}

    @render(SlidingChipStore, (store) => store.isResetScrollViewOffset)
    needResetScrollViewOffset() {
        this.snappedScrollView.scrollView.scrollToPercentHorizontal(0, 0.1, true);
    }

    @render(SlidingChipStore, (store) => store.chipValues)
    updateChipValues(chipValues: number[]) {
        this.chipValues = chipValues;
        this.createChips();
        this.updateChips();
    }

    @handle(SlidingChipHandler.UpdateChips)
    updateChips() {
        this.snappedScrollView.initCalculatedPercent();
    }

    updateScrollView() {}

    @render(SlidingChipStore, (store) => store.betItem)
    flyChip(betItem: TBetItem) {
        const { chipBox, bet } = betItem;
        bet > 0 && this.placeChipToChipBox(bet, chipBox, null, null);
    }

    public placeChipToChipBox(bet: number, destNode: Node, startNode: Node, onComplete: () => void) {
        const isLoginUserPlaceBet = startNode == null;
        const flyingDuration = isLoginUserPlaceBet ? this.loginUserChipFlyingTime : this.chipFlyingTime;

        // Audio Chip Fly

        const chipPosition = destNode.getComponent(UITransform).convertToNodeSpaceAR(this.createStartNodeInfo(startNode, bet).worldPos);
        const chipNode = this.createSmallChip(bet);
        chipNode.position = chipPosition;
        const randomPosition = this.getRandomPositionChip(chipNode, destNode);
        destNode.addChild(chipNode);

        if (!chipNode.activeInHierarchy) {
            chipNode.position = randomPosition;
        } else {
            this.moveChipTo(chipNode, randomPosition, flyingDuration, onComplete);
        }
    }

    private getRandomPositionChip(chip: Node, box: Node): Vec3 {
        const chipBoundingBox = chip.getComponent(UITransform).getBoundingBox();
        const xDest = random(
            Math.floor(chip.getComponent(UITransform).width / 4),
            Math.floor(box.getComponent(UITransform).width - chipBoundingBox.width / 2) + 1
        );
        const yDest = random(
            Math.floor(chip.getComponent(UITransform).height / 4),
            Math.floor(box.getComponent(UITransform).height - chipBoundingBox.height / 2) + 1
        );
        return v3(xDest, yDest);
    }

    protected createSmallChip(bet: number, scale = 0.29, showValue = false): Node {
        if (bet === 0) {
            const node = this.createLowValueChip();
            node.rotation = random(0, 360);
            node.scale = v3(this.smallChipScale, this.smallChipScale, this.smallChipScale);
            return node;
        }
        const chip = this.createBigChip(bet);
        const chipView = chip.getComponent(Chip);
        chipView.handleSmallChip(showValue);
        chip.scale = v3(scale, scale, scale);

        return chip;
    }

    protected createLowValueChip() {
        const node = new Node();
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.RAW;
        sprite.trim = false;
        sprite.spriteFrame = this.lowValueChipSprite;

        return node;
    }

    private createStartNodeInfo(startNode: Node, bet: number) {
        let worldPos: Vec3;
        let node = startNode;
        if (startNode) {
            worldPos = startNode.parent.getComponent(UITransform).convertToWorldSpaceAR(startNode.position);
        } else {
            let chip = this.getChipNode(bet);
            if (!chip) {
                const chips = this.chips.children.filter((child) => +child.name < bet).sort((b, a) => +a.name - +b.name);
                chip = chips[0];
            }
            const localPosition = v3(0, chip.getComponent(UITransform).height / 2, 0).add(chip.position);
            worldPos = chip.parent.getComponent(UITransform).convertToWorldSpaceAR(localPosition);
            node = this.node;
        }

        return { node, worldPos };
    }

    protected getChipNode(bet: number): Node {
        return this.chips.children.find((child) => child.name === bet.toString());
    }

    moveChipTo(chipNode: Node, randomPosition: Vec3, flyingDuration: number, onComplete?: () => void) {
        tween(chipNode)
            .to(flyingDuration, { position: v3(randomPosition.x, randomPosition.y, 0) }, { easing: "sineOut" })
            .call(() => {
                onComplete && onComplete();
            })
            .start();
    }

    public moveChipsWithRandomAmount(chipsBox: Node, destBox: Node, flyTime: number) {
        const randomAmount = 3;
        const destBoxPosition = destBox.parent.getComponent(UITransform).convertToWorldSpaceAR(destBox.position);
        const cloneChipsBox = instantiate(chipsBox);
        cloneChipsBox.destroyAllChildren();
        chipsBox.parent.addChild(cloneChipsBox);

        const destBoxInChipBoxSpacePosition = cloneChipsBox.getComponent(UITransform).convertToNodeSpaceAR(destBoxPosition);
        const chipsCount = round(random(1, randomAmount));

        for (let i = 0; i < chipsCount; i++) {
            const chip = chipsBox.children[i];

            if (chip) {
                const cloneChip = instantiate(chip);
                cloneChipsBox.addChild(cloneChip);
                this.moveChipThenDestroy(cloneChip, destBoxInChipBoxSpacePosition, flyTime);
            }
        }

        tween(this.node)
            .delay(flyTime * 1.5)
            .call(() => {
                cloneChipsBox.destroy();
            });
    }

    private moveChipThenDestroy(chip: Node, destBoxInChipBoxSpacePosition: Vec3, flyTime: number) {
        tween(chip)
            .call(() => {
                this.moveChipTo(chip, destBoxInChipBoxSpacePosition, flyTime);
            })
            .delay(0.5 * flyTime)
            .call(() => chip.destroy())
            .start();
    }
}
