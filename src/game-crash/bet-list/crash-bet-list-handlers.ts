import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashBetListStore, ICrashBetList } from "./crash-bet-list-store";

@injectable()
export class CrashBetListHandlers implements IMultipleHandlers {
    constructor(
        @inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore,
        @inject(CrashCashOutStore) private readonly crashCashoutStore: CrashCashOutStore,
        @inject(BetStore) private readonly betStore: BetStore
    ) {}

    handleBetList(betList: ICrashBetList) {
        this.betListStore.addBetList(betList, true);
    }

    handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        this.betListStore.addBetList({ [playerChip.playerId]: playerChip });
    }

    resetOtherPlayerList() {
        this.betListStore.resetOtherPlayerList();
    }

    resetMainPlayer() {
        this.betListStore.resetMainPlayer();
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
