import { inject, injectable } from "inversify";
import { BetStore } from "../../game/bets/bet-store";
import { ConnectionHandlers, ConnectionStore } from "../../game/connection";
import { RoundStore } from "../../game/rounds";
import { MainPlayerStore } from "../../players";
import { GameCrashEmitMessage } from "../game-crash-messages";
import { MultiplierStore } from "../multiplier";
import { CrashCashoutStore } from "./crash-cashout-store";

@injectable()
export class CrashCashOutUIHandlers {
    constructor(
        @inject(CrashCashoutStore) protected readonly cashoutStore: CrashCashoutStore,
        @inject(MultiplierStore) protected readonly multiplierStore: MultiplierStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(RoundStore) private readonly roundStore: RoundStore
    ) {}
    handle(cashOutValue: number, halfCashOut: boolean) {
        this.betStore.isProcessingBet = true;

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

    handleBetRatio() {
        this.cashoutStore.ratio = 1;
    }

    updateCashoutBetValue(value: number) {
        this.cashoutStore.cashoutBet = { value };
    }

    resetCashoutVaue() {
        this.cashoutStore.cashoutAmount = 0;
        this.cashoutStore.cashoutHalfAmount = 0;
    }
}
