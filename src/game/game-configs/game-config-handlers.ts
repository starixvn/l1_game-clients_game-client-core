import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameConfigStore } from "./game-config-store";
import { AppStore } from "../../app/app-store";

@injectable()
export class GameConfigHandlers implements IMultipleHandlers {
    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(AppStore) protected readonly appStore: AppStore
    ) {}

    handleGameConfigs(gameConfigs: GameServiceMessage.GameConfigs) {
        this.gameConfigStore.setGameConfigs(gameConfigs);
        this.appStore.isLoading = false;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.GameConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
