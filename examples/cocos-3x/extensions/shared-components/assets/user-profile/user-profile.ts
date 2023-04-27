import { _decorator, Component, Label, log, Sprite, SpriteFrame } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

import { bundleManager } from "../bundle-magager/bundle-manager";

const { Player } = GameClient;
const { PlayerStore } = Player;

const { ccclass, property, menu } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer
export default class UserProfile extends Component {
    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    balance: Label = null;

    @property(Sprite)
    avatar: Sprite = null;

    @render(PlayerStore, (store) => store.name)
    setName(text: string) {
        this.nameLabel && (this.nameLabel.string = text);
    }

    @render(PlayerStore, (store) => store.avatarId)
    async loadAvatar(avatarId: number) {
        log("Loading avatarId ", avatarId);
        const spriteFrame = await bundleManager.loadSharedAsset<SpriteFrame>(`images/avatars/${avatarId}/spriteFrame`, SpriteFrame);
        if (spriteFrame) {
            this.setAvatar(spriteFrame);
        }
    }

    setAvatar(frame: SpriteFrame) {
        this.avatar && (this.avatar.spriteFrame = frame);
    }

    @render(PlayerStore, (store) => store.balance)
    setBalance(value: number) {
        this.balance.string = value.toString();
    }
}
