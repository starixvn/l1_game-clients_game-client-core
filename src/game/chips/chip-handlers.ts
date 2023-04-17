import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { ChipStore, Chips } from "./chip-store";

@injectable()
export class ChipHandlers implements IMultipleHandlers {
    constructor(@inject(ChipStore) protected readonly store: ChipStore) {}

    eventHandleList = [
        {
            name: GameServiceMessage.chips,
            handle: this.handleChips,
        },
        {
            name: GameServiceMessage.PlayerChip.eventName,
            handle: this.handlePlayerChip,
        },
        {
            name: GameServiceMessage.OwnChip.eventName,
            handle: this.handleOwnChip,
        },
    ];

    handleChips(chips: Chips) {
        this.store.chips = chips;
    }

    handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        this.store.playerChip = playerChip;
    }

    handleOwnChip(ownChip: GameServiceMessage.OwnChip) {
        this.store.ownChip = ownChip;
    }
}
