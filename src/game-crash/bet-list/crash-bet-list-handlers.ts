import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { CrashCashoutStore } from "../cash-out/crash-cashout-store";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashBetListStore, ICrashBetList } from "./crash-bet-list-store";

@injectable()
export class CrashBetListHandlers implements IMultipleHandlers {
    constructor(
        @inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore,
        @inject(CrashCashoutStore) private readonly crashCashoutStore: CrashCashoutStore,
        @inject(BetStore) private readonly betStore: BetStore
    ) {}

    handleBetList(betList: ICrashBetList) {
        this.betListStore.addBetList(betList);
    }

    handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        this.betListStore.addBetList({ [playerChip.playerId]: playerChip });
    }

    resetOtherPlayerList() {
        this.betListStore.resetOtherPlayerList();
    }

    resetMainPlayer() {
        this.betStore.lastReceivedBet = { value: -1 };
        this.crashCashoutStore.cashOut = null;
        this.crashCashoutStore.halfCashOut = null;
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
