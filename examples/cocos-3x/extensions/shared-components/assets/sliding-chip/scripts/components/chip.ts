import { Color, Component, Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

const { observer, render, handle } = Observer;

const { Rounds, GameConfigs } = GameClient;

const { ccclass, property } = _decorator;

export enum ChipDisplayType {
    Normal = 0,
    VIP,
}

export default class Chip extends Component {
    @property(Node)
    background: Node = null;

    @property(Sprite)
    center: Sprite = null;

    @property(Sprite)
    border: Sprite = null;

    @property(SpriteFrame)
    centerFrames: SpriteFrame[] = [];

    @property(SpriteFrame)
    borderFrames: SpriteFrame[] = [];

    @property(Node)
    typeNodes: Node[] = [];

    @property(Label)
    label: Label = null;

    color = Color.WHITE;
    type = ChipDisplayType.Normal;

    setColor(color: Color) {
        this.color = color;
        this.background.getComponent(Sprite).color = color;
    }

    setValue(value: number) {
        this.node.name = value.toString();
    }
}
