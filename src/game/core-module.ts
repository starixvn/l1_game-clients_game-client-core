import { RoundHandlers } from "./rounds/round-handlers";
import { JoinGameHandlers } from "./join-game/join-game-handlers";
import { RoundTimeHandlers } from "./rounds/round-time-handlers";
import { GameConfigHandlers } from "./game-configs/game-config-handlers";
import { inject, injectable } from "inversify";
import { Mediator } from "../shared";

@injectable()
export class CoreModule {
    constructor(
        @inject(Mediator) mediator: Mediator,
        @inject(RoundTimeHandlers) roundTimeHandlers: RoundTimeHandlers,
        @inject(JoinGameHandlers) joinGameHandlers: JoinGameHandlers,
        @inject(GameConfigHandlers) gameConfigHandlers: GameConfigHandlers,
        @inject(RoundHandlers) roundHandlers: RoundHandlers
    ) {
        mediator.registerMultipleHandlers([roundTimeHandlers, joinGameHandlers, roundHandlers, gameConfigHandlers]);
    }
}
