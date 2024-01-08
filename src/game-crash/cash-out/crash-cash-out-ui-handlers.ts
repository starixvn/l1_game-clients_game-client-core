import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { ConnectionHandlers, ConnectionStore } from "../../game/connection";
import { RoundStore } from "../../game/rounds";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MainPlayerStore } from "../../players";
import { GameCrashEmitMessage } from "../game-crash-messages";
import { MultiplierStore } from "../multiplier";
import { CrashCashOutStore } from "./crash-cash-out-store";

@injectable()
export class CrashCashOutUIHandlers {
    constructor(
        @inject(CrashCashOutStore) protected readonly cashOutStore: CrashCashOutStore,
        @inject(MultiplierStore) protected readonly multiplierStore: MultiplierStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(RoundStore) private readonly roundStore: RoundStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {}

    handle(cashOutValue: number, halfCashOut: boolean) {
        const cashOutData = {
            username: this.mainPlayerStore.name,
            roundId: this.roundStore.clientRoundId,
            clientSendTime: new Date(),
            halfCashOut,
            m: cashOutValue,
        };
        this.connectionStore.send(GameCrashEmitMessage.CashOut.eventName, cashOutData);
        this.retryGameHandler.handle();
    }

    resetCashOutValue() {
        this.cashOutStore.cashOut && (this.cashOutStore.cashOut.win = 0);
        this.cashOutStore.halfCashOut && (this.cashOutStore.halfCashOut.win = 0);
    }
}
