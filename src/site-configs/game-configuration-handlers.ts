import { inject, injectable } from "inversify";
import { IHandler } from "../shared/mediator";
import { UrlUtils } from "../shared/utils";
import { Configs } from "./configs";
import { GameConfigurationStore } from "./game-configuration-store";

@injectable()
export class GameConfigurationHandler implements IHandler<void> {
    constructor(
        @inject(Configs) private readonly config: Configs,
        @inject(GameConfigurationStore) private readonly store: GameConfigurationStore
    ) {}

    async handle() {
        const url = this.config.isDev
            ? this.config.optionsDev.gameConfigurationUrl
            : UrlUtils.buildProxyUrl("/game/configurations/", this.config);

        const configurations = await fetch(url, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .catch(() => []);
        this.store.setGameConfiguration(configurations);
        console.log("store configurations", this.store.gameConfigurations);
    }
}
