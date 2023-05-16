import { _decorator, Animation, Component, Node, Sprite, SpriteFrame, tween, UIOpacity, v2, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class SediePlate extends Component {
    @property(Animation)
    shakePlateAnim: Animation = null;

    @property(Node)
    theBowl: Node = null;

    @property([Sprite])
    dots: Sprite[] = [];

    @property(SpriteFrame)
    dotRed: SpriteFrame = null;

    @property(SpriteFrame)
    dotWhite: SpriteFrame = null;

    openPlateDuration = 0.5;

    setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }

    toggleDotsActive(show: boolean) {
        this.dots.forEach((dot) => {
            dot.node.active = show;
        });
    }

    shakePlate() {
        tween(this.node)
            .delay(0.5)
            .call(() => {
                this.toggleDotsActive(false);
                this.shakePlateAnim.play();
            })
            .start();
    }

    openBowl(animated: boolean) {
        this.toggleDotsActive(true);
        const platePos = v2(50, 100);

        if (animated) {
            tween(this.theBowl)
                .to(this.openPlateDuration, { position: v3(platePos.x, platePos.y) }, { easing: "sineInOut" })
                .start();
            tween(this.theBowl.getComponent(UIOpacity)).delay(this.openPlateDuration).to(0.2, { opacity: 0 }).start();
        } else {
            this.theBowl.position = v3(platePos.x, platePos.y);
            this.theBowl.getComponent(UIOpacity).opacity = 0;
        }
    }

    closeBowl(animated: boolean) {
        if (animated) {
            const platePos = v2(50, 100);
            this.theBowl.position = v3(platePos.x, platePos.y);
            tween(this.theBowl.getComponent(UIOpacity)).to(0, { opacity: 255 }).start();
            tween(this.theBowl)
                .to(0.5, { position: v3(0, 0) })
                .start();
        } else {
            this.theBowl.getComponent(UIOpacity).opacity = 255;
            this.theBowl.position = v3(0, 0);
        }
    }
}
