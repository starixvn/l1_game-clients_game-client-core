import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { CrashGameConfigStore } from "./crash-game-config-store";

@injectable()
export class CrashGameConfigHandlers implements IMultipleHandlers {
    constructor(@inject(CrashGameConfigStore) protected readonly gameConfigStore: CrashGameConfigStore) {}

    handleGameConfigs(gameConfigs: GameServiceMessage.CrashGameConfigs) {
        this.gameConfigStore.maxMultiplier = gameConfigs.maxMultiplier;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.GameConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
