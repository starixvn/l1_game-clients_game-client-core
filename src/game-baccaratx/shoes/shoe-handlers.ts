import { inject, injectable } from "inversify";
import { ConnectionHandlers } from "../../game/connection/connection-handlers";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { CutCardHandler } from "./../../features/provably-fair/cut-card-game/cut-card-handler";
import { ShoeStore } from "./shoe-store";

@injectable()
export class ShoeHandlers implements IMultipleHandlers {
    constructor(
        @inject(CutCardHandler) protected readonly cutCardHandler: CutCardHandler,
        @inject(ShoeStore) protected readonly shoeStore: ShoeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler
    ) {}

    handleNewShoeHash(newShoeHash: GameServiceMessage.NewShoeHash) {
        this.shoeStore.newShoeHash = newShoeHash;
    }

    handleShoeInfo(shoeInfo: GameServiceMessage.ShoeInfo) {
        this.shoeStore.shoeInfo = shoeInfo;
        shoeInfo && this.cutCardHandler.resetCutCardInfo();
    }

    eventHandleList = [
        {
            name: GameServiceMessage.NewShoeHash.eventName,
            handle: this.handleNewShoeHash,
        },
        {
            name: GameServiceMessage.ShoeInfo.eventName,
            handle: this.handleShoeInfo,
        },
    ];

    sendCardIndex(index: number) {
        this.shoeStore.shoeInfo.currentIndex = index;
    }
}
