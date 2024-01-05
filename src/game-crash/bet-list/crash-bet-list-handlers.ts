import { inject, injectable } from "inversify";

import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashBetListStore, ICrashBetList } from "./crash-bet-list-store";

@injectable()
export class CrashBetListHandlers implements IMultipleHandlers {
    constructor(@inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore) {}

    handleBetList(betList: ICrashBetList) {
        this.betListStore.addBetList(betList, true);
    }

    handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        this.betListStore.addBetList({ [playerChip.playerId]: playerChip });
    }

    eventHandleList = [
        {
            name: GameCrashServiceMessage.BetList.eventName,
            handle: this.handleBetList,
        },
        {
            name: GameServiceMessage.PlayerChip.eventName,
            handle: this.handlePlayerChip,
        },
    ];
}
