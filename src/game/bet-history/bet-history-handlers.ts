import { inject, injectable } from "inversify";
import { GameServiceMessage, IHandler, IMultipleHandlers } from "../../shared";
import { ConnectionStore } from "../connection";
import { BetHistoryModel, BetHistoryStore } from "./bet-history-store";
import { NoticeStore } from "../notices";

export namespace BetHistoryHandlers {
    @injectable()
    export class BetHistoryPopupHandlers implements IMultipleHandlers {
        constructor(
            @inject(BetHistoryStore)
            protected readonly betHistoryStore: BetHistoryStore
        ) {}

        handleShowBetHistory(data: BetHistoryModel) {
            this.betHistoryStore.setData(data);
            this.betHistoryStore.setShowBetHistory(true);
        }

        eventHandleList = [
            {
                name: GameServiceMessage.BetHistory.eventName,
                handle: this.handleShowBetHistory,
            },
        ];
    }

    @injectable()
    export class BetHistoryCallServiceHandler implements IHandler<void> {
        constructor(
            @inject(ConnectionStore)
            protected readonly connectionStore: ConnectionStore
        ) {}

        handle() {
            this.connectionStore.send(GameServiceMessage.BetHistory.getHistoryEvent, { page: 1 });
        }
    }
}
