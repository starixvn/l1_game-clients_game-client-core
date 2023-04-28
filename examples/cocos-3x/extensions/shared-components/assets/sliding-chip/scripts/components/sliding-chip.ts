import { AudioSource, Component, Prefab, SpriteAtlas, SpriteFrame, _decorator } from "cc";
import Observer from "observer";
import { ChipScrollView } from "./chip-scroll-view";

const { observer, render, handle } = Observer;

const { ccclass, property } = _decorator;

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

    @property(ChipScrollView)
    snappedScrollView: ChipScrollView = null;

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
}
