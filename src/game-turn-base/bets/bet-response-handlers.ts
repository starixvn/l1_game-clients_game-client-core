import { inject, injectable } from "inversify";
import { GameServiceMessage } from "../../shared";
import { BetResponseHandlers as BetResponseHandlersBase } from "../../game/bets";
import { BetStore } from "../../game/bets";
import { RoundTimeStore } from "../rounds";
import { ConnectionHandlers } from "../../game/connection";

@injectable()
export class BetResponseHandlers extends BetResponseHandlersBase {
    constructor(
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler
    ) {
        super(betStore, roundTimeStore, retryGameHandler);
    }

    handleBetChoice(betChoice: any) {}

    eventHandleList = [
        ...this.eventHandleList,
        {
            name: GameServiceMessage.betChoice,
            handle: this.handleBetChoice,
        },
    ];
}
