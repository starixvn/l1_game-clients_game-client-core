import gc from "game-client-base";
import { sharedContainer } from "../../../scripts/shared-container";

import { _decorator, Component } from "cc";
import mobx from "mobx";
import Observer from "observer";

const { ccclass } = _decorator;
const { observer, handle } = Observer;

Observer.configure({ default: { mobx, container: sharedContainer } });

@ccclass
@observer("default")
export class SessionTimeoutComponent extends Component {
    onLoad() {
        this.sessionTimeout();
    }

    @handle(gc.Auth.AuthHandlers.SessionTimeout)
    sessionTimeout() {}
}
