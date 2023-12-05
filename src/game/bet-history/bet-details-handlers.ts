import { inject, injectable } from "inversify";

import { IHandler } from "../../shared";
import { BetDetailHitoryStore } from "./bet-details-history-store";
import { BetHistoryLog } from "./bet-history-store";

@injectable()
export class BetDetailsHandlers implements IHandler<BetHistoryLog> {
    constructor(
        @inject(BetDetailHitoryStore)
        private readonly betDetailStore: BetDetailHitoryStore
    ) {}

    handle(betHistoryLog: BetHistoryLog) {
        this.betDetailStore.setData(betHistoryLog);
    }
}
