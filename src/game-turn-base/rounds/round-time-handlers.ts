import { inject, injectable } from "inversify";
import { RoundTimeStore } from "./round-time-store";
import { RoundRunningHandlers, RoundTimeHandlers as RoundTimeHandlersBase } from "../../game/rounds";

@injectable()
export class RoundTimeHandlers extends RoundTimeHandlersBase {
    constructor(
        @inject(RoundTimeStore) protected readonly store: RoundTimeStore,
        @inject(RoundRunningHandlers) protected readonly roundRunningHandlers: RoundRunningHandlers
    ) {
        super(store, roundRunningHandlers);
    }

    override handleRemainingTime(remainingTime: number) {
        this.roundRunningHandlers.stopRunner();
        this.store.totalMainRoundTime = remainingTime;
        this.roundRunningHandlers.startRunner();
    }
}
