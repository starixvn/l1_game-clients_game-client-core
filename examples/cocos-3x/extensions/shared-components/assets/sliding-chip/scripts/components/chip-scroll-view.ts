import { _decorator, Component, ScrollView } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

const { observer, render, handle } = Observer;

const { Rounds, GameConfigs } = GameClient;

const { ccclass, property } = _decorator;
export class ChipScrollView extends Component {
    @property
    itemSize = 85;

    @property
    spacing = 8;

    @property
    enableHalfSpacing = true;

    @property
    isHorizontalLayout = true;

    public onScrollEnded = () => {};

    private readonly calculatedPercent: number[] = [];
    private minDisplayIndex = 0;

    private _scroll: ScrollView;
    get scroll() {
        if (!this._scroll) {
            this._scroll = this.getComponent(ScrollView);
        }
        return this._scroll;
    }
    private scrollBegan = false;
}
