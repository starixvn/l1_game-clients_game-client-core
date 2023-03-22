import { JoinGameHandlers } from "./join-game/join-game-handlers";
import { RoundTimeHandlers } from "./round-time/round-time-handlers";
import { inject, injectable } from "inversify";
import { Mediator } from "../common";

@injectable()
export class CoreModule {
  constructor(
    @inject(Mediator) mediator: Mediator,
    @inject(RoundTimeHandlers) roundTimeHandlers: RoundTimeHandlers,
    @inject(JoinGameHandlers) joinGameHandlers: JoinGameHandlers
  ) {
    mediator.registerMultipleHandlers([roundTimeHandlers, joinGameHandlers]);
  }
}
