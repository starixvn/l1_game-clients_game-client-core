import { inject, injectable } from "inversify";
import { GameServiceMessage, IHandler } from "../../shared";
import { ConnectionStore } from "../connection";
import { BetHistoryModel, BetHistoryStore } from "./bet-history-store";

export namespace BetHistoryHandlers {
    @injectable()
    export class BetHistoryPopupHandlers implements IHandler<BetHistoryModel> {
        name = GameServiceMessage.BetHistory.eventName;

        constructor(
            @inject(BetHistoryStore)
            protected readonly betHistoryStore: BetHistoryStore
        ) {}

        handle(data: BetHistoryModel) {
            this.betHistoryStore.setData(data);
        }
    }

    @injectable()
    export class BetHistoryCallServiceHandler implements IHandler<number> {
        constructor(
            @inject(ConnectionStore)
            protected readonly connectionStore: ConnectionStore
        ) {}

        handle(page = 1) {
            this.connectionStore.send(GameServiceMessage.BetHistory.getHistoryEvent, { page });
        }
    }
}
