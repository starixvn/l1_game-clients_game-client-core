import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { BaccaratXGameConfigStore } from "./baccaratx-game-config-store";

@injectable()
export class BaccaratXGameConfigHandlers implements IMultipleHandlers {
    constructor(@inject(BaccaratXGameConfigStore) protected readonly gameConfigStore: BaccaratXGameConfigStore) {}

    handleGameConfigs(gameConfigs: GameServiceMessage.BaccaratXGameConfigs) {
        this.gameConfigStore.extraFeeRatio = gameConfigs.extraFeeRatio;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.GameConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
