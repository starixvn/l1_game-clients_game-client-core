import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameConfigStore } from "./game-config-store";

@injectable()
export class GameConfigHandlers implements IMultipleHandlers {
    constructor(@inject(GameConfigStore) protected readonly store: GameConfigStore) {}

    handleGameConfigs(gameConfigs: GameServiceMessage.GameConfigs) {
        this.store.setGameConfigs(gameConfigs);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.GameConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
