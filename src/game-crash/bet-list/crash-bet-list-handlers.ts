import { inject, injectable } from "inversify";

import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashBetListStore, ICrashBetList } from "./crash-bet-list-store";

@injectable()
export class CrashBetListHandlers implements IMultipleHandlers {
    constructor(@inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore) {}

    handleBetList(betList: ICrashBetList) {
        this.betListStore.betList = betList;
    }

    handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        this.betListStore.betList = { [playerChip.playerId]: playerChip };
    }

    resetOtherPlayerList() {
        this.betListStore.resetOtherPlayerList();
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
