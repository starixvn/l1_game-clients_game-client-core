import { inject, injectable } from "inversify";

import { BetStore } from "../../game/bets/bet-store";
import { NoticeStore } from "../../game/notices/notice-store";
import { RoundTimeStore } from "../../game/rounds";
import { MainPlayerStore } from "../../players/main-player-store";
import { IHandler } from "../../shared";
import { AutoPlayHandler, AutoPlayStore } from "../auto-play";
import { BetInputStore } from "../bet-input/bet-input-store";
import { PlayerActionStore } from "../player-actions";
import { CrashBetHandler } from "./crash-bet-handler";
import { EarlyBetStore } from "./early-bet-store";

@injectable()
export class EarlyBetUIHandlers implements IHandler<boolean> {
    constructor(
        @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore,
        @inject(BetInputStore) private readonly betInputStore: BetInputStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(PlayerActionStore) private readonly playerActionStore: PlayerActionStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(CrashBetHandler) private readonly crashBetHandler: CrashBetHandler,
        @inject(AutoPlayHandler) private readonly autoPlayHandler: AutoPlayHandler,
        @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore
    ) {}

    handle() {}
}
