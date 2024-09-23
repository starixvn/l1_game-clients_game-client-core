import { inject, injectable } from "inversify";
import { BetHandlerBase } from "../../game/bets/bet-handler-base";
import { BetStore } from "../../game/bets/bet-store";
import { ConnectionHandlers, ConnectionStore } from "../../game/connection";
import { GameSetting } from "../game-configs/game-setting";
import { NoticeStore } from "../../game/notices";
import { OrientationStore } from "../../game/orientation";
import { RoundStore, RoundTimeStore } from "../../game/rounds";
import { MainPlayerStore } from "../../players";
import { ProvablyFairStore } from "../../features/provably-fair/round-base";
import { IBetInfo } from "../../game/bets";

@injectable()
export class BetHandler extends BetHandlerBase {
    constructor(
        @inject(ConnectionStore) protected readonly connectionStore: ConnectionStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(OrientationStore) protected readonly orientationStore: OrientationStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(RoundStore) private readonly roundStore: RoundStore,
        @inject(ProvablyFairStore) private readonly provablyFairStore: ProvablyFairStore
    ) {
        super(connectionStore, betStore, mainPlayerStore, orientationStore, roundTimeStore, noticeStore, retryGameHandler, gameSetting);
    }

    handle(betInfo: IBetInfo) {
        const betChoices: Record<string, number> = {
            [betInfo.betChoice]: betInfo.amount
        }
        const betData = this.createBetData({
            betChoices, clientSeed: this.provablyFairStore.clientSeed,
            clientSeedDetail: {
                randomClientSeed: this.provablyFairStore.randomClientSeed
            }
        });

        this.handleBetData(betData);
    }
}
