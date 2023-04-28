import { inject, injectable } from "inversify";

import { PlayerStore } from "../../players";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { ConnectionStore } from "../connection/connection-store";
import { OrientationStore } from "../orientation/orientation-store";
import { BetStore } from "./bet-store";

@injectable()
export class BetHandler implements IHandler<string> {
    constructor(
        @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(PlayerStore) private readonly playerStore: PlayerStore,
        @inject(OrientationStore) private readonly orientationStore: OrientationStore
    ) {}

    handle(betChoice: string) {
        const amount = this.betStore.amount;
        const freeBet = this.betStore.freebetEnabled && amount <= this.playerStore.scoin;
        const betData = {
            m: this.orientationStore.m,
            username: this.playerStore.name,
            betChoice: betChoice,
            amount,
            freeBet,
        };
        this.connectionStore.send(GameClientEmitMessage.Bet.eventName, betData);
    }
}
