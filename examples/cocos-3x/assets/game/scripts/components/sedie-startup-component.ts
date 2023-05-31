import { _decorator } from "cc";
import StartupComponent from "db://shared-components/game/scripts/components/startup-component";
import { startGame } from "db://shared-components/scripts/startup";
import gc from "game-client-base";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";

import { containerOptions, settings } from "../sedie-settings";

gc.sentryLogger.start(siteConfigs.sentryUrl, siteConfigs.env, settings.name);
startGame(settings.name, containerOptions);

@_decorator.ccclass
@Observer.observer(settings.name)
export default class Startup extends StartupComponent {
    onLoad() {
        this.namespace = settings.name;
        super.onLoad();
    }
}
