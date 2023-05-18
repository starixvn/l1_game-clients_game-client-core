import { _decorator } from "cc";
import StartupComponent from "db://shared-components/game/scripts/components/startup-component";
import { startGame } from "db://shared-components/scripts/startup";
import Observer from "observer";

import { containerOptions, settings } from "../sedie-settings";

startGame(settings.name, containerOptions);

@_decorator.ccclass
@Observer.observer(settings.name)
export default class Startup extends StartupComponent {
    onLoad() {
        this.namespace = settings.name;
        super.onLoad();
    }
}
