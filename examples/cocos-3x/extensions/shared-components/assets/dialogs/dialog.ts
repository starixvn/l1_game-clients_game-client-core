import { _decorator, Component, Node } from "cc";
import { bounceIn, bounceOut, fadeIn, fadeOut } from "../utils/utils";
const { ccclass, property } = _decorator;

@ccclass("Dialog")
export class Dialog extends Component {
    @property(Node)
    nodeFadeBackground: Node = null;

    @property(Node)
    nodeBody: Node = null;

    protected readonly appearDuration = 0.4;

    onEnable() {
        this.show();
    }

    show() {
        fadeIn(this.nodeFadeBackground, 0.1);
        fadeIn(this.nodeBody, 0.3);
        bounceIn(this.nodeBody, this.nodeBody.scale, this.appearDuration);
    }

    hide() {
        fadeOut(this.nodeFadeBackground, this.appearDuration);
        fadeOut(this.nodeBody, this.appearDuration);
        bounceOut(this.nodeBody, this.appearDuration).then(() => {
            this.node.destroy();
        });
    }
}
