import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { RoundTimeStore } from "../rounds";
import { RoundHistory, RoundHistoryStore } from "./round-history-store";

@injectable()
export class RoundHistoryHandlers implements IMultipleHandlers {
    constructor(
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {}

    eventHandleList = [
        {
            name: GameServiceMessage.roundHistory,
            handle: this.handleRoundHistory,
        },
    ];

    handleRoundHistory(roundHistories: RoundHistory[]) {
        this.roundHistoryStore.histories = roundHistories;
        this.roundTimeStore.setJoinGameState();
    }
}
